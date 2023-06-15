import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { PromotionAllowance } from 'src/common/schema/common.schema';
import { CoreService } from 'src/common/service/core.service';
import { EModule, ESubscriptionStatus, EUser } from 'src/common/util/enumn';
import { AppRequest, TriggeredBy } from 'src/common/util/type';
import { CuponCode } from 'src/cupon/schema/cupon_code.schema';
import { Promotion } from 'src/promotion/promotion.schema';
import { Subscription } from 'src/subscription/subscription.schema';
import { CalculatePriceDto, CreateOSubscriptionDto, GetSubscriptionsDto } from './o_subscription.dto';
import { OSubscription } from './o_subscription.schema';

@Injectable()
export class OSubscriptionService extends CoreService<OSubscription> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(OSubscription.name) model: Model<OSubscription>,
    @InjectModel(Category.name) categoryModel: Model<Category>,
    @InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>,
    @InjectModel(Promotion.name) private readonly promotionModel: Model<Promotion>,
    @InjectModel(CuponCode.name) private readonly cuponCodeModel: Model<CuponCode>,
  ) {
    super(connection, model, categoryModel);
  }

  async calculateSubscriptionPrice(
    dto: CalculatePriceDto,
    req: AppRequest,
    res: Response,
    trigger?: TriggeredBy,
  ) {
    return this.makeTransaction({
      action: async (ses) => {
        const session = trigger?.session ?? ses;

        const getMaxValue = (obj, num) => {
          const arr = Object.keys(obj)
            .filter((each) => +each <= num)
            .sort((a, b) => +a - +b);
          return +arr[arr.length - 1];
        };

        const { numDay, numSlot, subscriptionId, cuponCode } = dto;
        const subscription = await this.findById({
          id: subscriptionId,
          custom: this.subscriptionModel,
          options: { populate: ['activePromotion'] },
        });

        const originalAmount = getMaxValue(getMaxValue(subscription.price, numSlot), numDay) * numDay;
        const promotion = subscription.activePromotion;
        let amount = originalAmount;
        let pointsEarned = 0;
        let cupon;

        const getAllowance = (allowance: PromotionAllowance) => {
          const extraAmount = allowance.isPercent
            ? originalAmount * (allowance.amount / 100)
            : allowance.amount;
          if (allowance.isPoint) pointsEarned += extraAmount;
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
          cupon = cupCode.cupon;
        }
        return { subscription, originalAmount, amount, pointsEarned, promotion, cupon };
      },
      req,
      res,
      audit: {
        name: 'calculate-subscription-price',
        payload: dto,
        module: EModule.Subscription,
        triggeredBy: trigger?.service,
      },
    });
  }

  async requestSubscription(dto: CreateOSubscriptionDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const {
          subscriptionId,
          payAmount,
          paymentProof,
          paymentMethod: categoryId,
          cuponCode,
          ...payload
        } = dto;
        const { subscription, originalAmount, amount, pointsEarned, promotion, cupon } =
          await this.calculateSubscriptionPrice(
            { subscriptionId, cuponCode, numSlot: payload.numSlot, numDay: payload.numDay },
            req,
            res,
            { session, service: 'request-subscription' },
          );
        if (payAmount < amount) throw new BadRequestException(`Payment is less the require amount`);
        const paymentMethod = await this.findById({ id: categoryId, custom: this.categoryModel });
        let surplus;
        if (payAmount > amount) surplus = payAmount - amount;
        const payment = {
          originalAmount,
          amount,
          payAmount,
          surplus,
          cuponCode,
          cupon,
          promotion,
          paymentMethod,
          pointsEarned,
          paymentProof,
        };
        return await this.create({
          dto: {
            ...payload,
            payment,
            status: ESubscriptionStatus.Pending,
            organization: req.user.currentOrganization.organization,
            subscription,
            isAddon: subscription.isAddon,
          },
          session,
        });
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

  async getSubscriptions(dto: GetSubscriptionsDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async () => {
        const { organizationId, status, ...pagination } = dto;
        if (req.type !== EUser.ErApp && organizationId)
          throw new ForbiddenException("Can't access other organization");
        return this.find({ filter: { status, organization: organizationId }, ...pagination });
      },
      req,
      res,
      audit: { name: 'get-subscriptions', module: EModule.Organization, payload: dto },
    });
  }
}
