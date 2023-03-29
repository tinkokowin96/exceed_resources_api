import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { EModule } from 'src/common/util/enumn';
import { PaymentType } from 'src/common/util/schema.type';
import { AppRequest } from 'src/common/util/type';
import { Cupon } from 'src/er_app/schema/cupon.schema';
import { RequestSubscriptionDto } from './dto/request_subscription.dto';
import { AddonSubscriptionRequest } from './schema/addon_subscription_request.schema';
import { SubscriptionRequest } from './schema/subscription_request.schema';

@Injectable()
export class SubscriptionRequestService extends CoreService {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(SubscriptionRequest.name) model: Model<SubscriptionRequest>,
    @InjectModel(AddonSubscriptionRequest.name) addonModel: Model<AddonSubscriptionRequest>,
    @InjectModel(Cupon.name) private readonly cuponModel: Model<Cupon>,
  ) {
    super(connection, model);
  }

  async requestSubscription(
    { organizationId, cuponId, payment: paymentMethod, ...dto }: RequestSubscriptionDto,
    req: AppRequest,
    res: Response,
  ) {
    return this.makeTransaction({
      action: async (session) => {
        let cupon;
        const payment: PaymentType = { ...paymentMethod, amount: paymentMethod.originalAmount };
        if (cuponId) {
          cupon = await this.findById({ id: cuponId, custom: this.cuponModel });
        }
        return await this.create({ dto });
      },
      req,
      res,
      audit: {
        name: 'sub-req',
        module: EModule.Subscription,
        payload: { organizationId, cuponId, ...dto },
      },
    });
  }
}
