import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { ClientSession, Connection, Model } from 'mongoose';
import { PromotionAllowance } from 'src/common/schema/common.schema';
import { CoreService } from 'src/common/service/core.service';
import { EModule } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { CuponCode } from 'src/er_app/cupon/schema/cupon_code.schema';
import { Promotion } from 'src/er_app/promotion/promotion.schema';
import { Subscription } from 'src/er_app/subscription/subscription.schema';
import { Organization } from 'src/organization/schema/organization.schema';
import { CalculatePriceDto, CreateOSubscriptionDto } from './o_subscription.dto';
import { OSubscription } from './o_subscription.schema';

@Injectable()
export class OSubscriptionService extends CoreService<OSubscription> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(OSubscription.name) model: Model<OSubscription>,
    @InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>,
    @InjectModel(Organization.name) private readonly organizationModel: Model<Organization>,
    @InjectModel(Promotion.name) private readonly promotionModel: Model<Promotion>,
    @InjectModel(CuponCode.name) private readonly cuponCodeModel: Model<CuponCode>,
  ) {
    super(connection, model);
  }

  async calculateSubscriptionPrice(
    dto: CalculatePriceDto,
    req: AppRequest,
    res: Response,
    trigger?: ClientSession,
  ) {
    return this.makeTransaction({
      action: async (ses) => {
        const session = trigger ?? ses;

        const getMaxValue = (obj) => {
          const arr = Object.keys(obj)
            .filter((each) => +each <= numEmployee)
            .sort((a, b) => +a - +b);
          return +arr[arr.length - 1];
        };

        const { numDay, numEmployee, subscriptionId, cuponCode } = dto;
        const subscription = await this.findById({
          id: subscriptionId,
          custom: this.subscriptionModel,
          options: { populate: ['activePromotion'] },
        });

        const originalAmount = getMaxValue(getMaxValue(subscription.price)) * numDay;
        const promotion = subscription.activePromotion;
        let amount = originalAmount;
        let pointEarned = 0;

        const getAllowance = (allowance: PromotionAllowance) => {
          const extraAmount = allowance.isPercent
            ? originalAmount * (allowance.amount / 100)
            : allowance.amount;
          if (allowance.isPoint) pointEarned += extraAmount;
          else amount -= extraAmount;
        };

        if (promotion) {
          if (
            promotion.active_until &&
            promotion.active &&
            new Date(promotion.active_until).getTime() < Date.now()
          ) {
            await this.findByIdAndUpdate({
              id: promotion._id,
              update: {
                $set: { active: false },
              },
              custom: this.promotionModel,
              session,
            });
          } else getAllowance(promotion.allowance);
        }
        if (cuponCode) {
          const cupCode = await this.findOne({
            filter: { code: cuponCode },
            options: { populate: ['cupon'] },
            custom: this.cuponCodeModel,
          });
          if (cupCode.numUsed >= cupCode.numUsable) throw new BadRequestException('Cupon code already used');
          getAllowance(cupCode.cupon.allowance);
        }
        return { originalAmount, amount, pointEarned };
      },
      req,
      res,
      audit: trigger
        ? undefined
        : { name: 'calculate-subscription-price', payload: dto, module: EModule.Subscription },
    });
  }

  async requestSubscription(dto: CreateOSubscriptionDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        // const { cuponCode, subscriptionId, payment: paymentMethod, ...payload } = dto;
        // const payment: Payment = await this.cuponService.getPayment({ ...paymentMethod, cuponCode });
        // const organization = await this.findById({ id: organizationId, custom: this.organizationModel });
        // return await this.create({
        //   dto: { ...payload, organization, payment, addon: addon ?? undefined },
        //   custom: this.subRequestModel,
        //   session,
        // });
      },
      req,
      res,
      audit: {
        name: `request-subscription`,
        module: EModule.Subscription,
        payload: dto,
      },
    });
  }

  // async getOSubscriptions(dto: GetSubscriptionsDto, req: AppRequest, res: Response, trigger?: ClientSession) {
  //   return this.makeTransaction({
  //     action: async (ses) => {
  //       const { ids, ...pagination } = dto;
  //       const session = trigger ?? ses;
  //       const { next, numItems } = await this.updateMany({
  //         filter: { _id: ids ? { $in: ids } : undefined },
  //         update: {
  //           $set: {
  //             active: {
  //               $gt: ['$activeUntil', new Date()],
  //             },
  //           },
  //         },
  //         session,
  //         pagination,
  //       });
  //       return { items: next, numItems };
  //     },
  //     req,
  //     res,
  //     audit: trigger
  //       ? undefined
  //       : { name: 'get-subscriptions-and-update', payload: dto, module: EModule.Subscription },
  //   });
  // }
}
