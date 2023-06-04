import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { ClientSession, Connection, Model } from 'mongoose';
import { Payment } from 'src/common/schema/common.schema';
import { CoreService } from 'src/common/service/core.service';
import { EModule } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { CuponService } from 'src/er_app/cupon/cupon.service';
import { Organization } from 'src/organization/schema/organization.schema';
import { OSubscription } from './schema/o_subscription.schema';
import { Subscription } from 'src/er_app/subscription/schema/subscription.schema';
import { CalculatePriceDto, CreateOSubscriptionDto } from './dto/o_subscription.dto';

@Injectable()
export class OSubscriptionService extends CoreService<OSubscription> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(OSubscription.name) model: Model<OSubscription>,
    @InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>,
    @InjectModel(Organization.name) private readonly organizationModel: Model<Organization>,
    private readonly cuponService: CuponService,
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
        const { numDay, numEmployee, subscriptionId, addonSubscriptionId, payment } = dto;
        let subscription: Subscription | AddonSubscription;
        if (!subscriptionId && !addonSubscriptionId)
          throw new BadRequestException('Subscription or addon subscription id is required');
        if (subscriptionId)
          subscription = await this.findById({ id: subscriptionId, custom: this.subscriptionModel });
        else
          subscription = await this.findById({
            id: addonSubscriptionId,
            custom: this.addonModel,
          });
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
        const { cuponCode, addonSubscriptionId, subscriptionId, payment: paymentMethod, ...payload } = dto;
        const payment: Payment = await this.cuponService.getPayment({ ...paymentMethod, cuponCode });
        const organization = await this.findById({ id: organizationId, custom: this.organizationModel });
        return await this.create({
          dto: { ...payload, organization, payment, addon: addon ?? undefined },
          custom: this.subRequestModel,
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
}
