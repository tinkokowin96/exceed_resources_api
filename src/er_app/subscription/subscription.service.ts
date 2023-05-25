import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { Payment } from 'src/common/schema/common.schema';
import { CoreService } from 'src/common/service/core.service';
import { EModule } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { CuponService } from 'src/er_app/cupon/cupon.service';
import { Organization } from 'src/organization/schema/organization.schema';
import { RequestSubscriptionDto } from './dto/subscription_request.dto';
import { Subscription } from './schema/subscription.schema';
import { SubscriptionRequest } from './schema/subscription_request.schema';

@Injectable()
export class SubscriptionService extends CoreService<Subscription> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Subscription.name) model: Model<Subscription>,
    @InjectModel(SubscriptionRequest.name)
    private readonly subRequestModel: Model<SubscriptionRequest>,
    @InjectModel(Organization.name) private readonly organizationModel: Model<Organization>,
    private readonly cuponService: CuponService,
  ) {
    super(connection, model);
  }

  async requestSubscription(dto: RequestSubscriptionDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const { organizationId, cuponCode, addon, payment: paymentMethod, ...payload } = dto;
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
