import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { EModule } from 'src/common/util/enumn';
import { PaymentType } from 'src/common/util/schema.type';
import { AppRequest } from 'src/common/util/type';
import { CuponService } from 'src/er_app/service/cupon.service';
import { Organization } from 'src/organization/schema/organization.schema';
import { RequestSubscriptionDto } from './dto/request_subscription.dto';
import { AddonSubscriptionRequest } from './schema/addon_subscription_request.schema';
import { SubscriptionRequest } from './schema/subscription_request.schema';

@Injectable()
export class SubscriptionRequestService extends CoreService {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(SubscriptionRequest.name) model: Model<SubscriptionRequest>,
    @InjectModel(AddonSubscriptionRequest.name) private readonly addonModel: Model<AddonSubscriptionRequest>,
    @InjectModel(Organization.name) private readonly organizationModel: Model<Organization>,
    private readonly cuponService: CuponService,
  ) {
    super(connection, model);
  }

  async requestSubscription(
    { organizationId, cuponCode, addon, payment: paymentMethod, ...dto }: RequestSubscriptionDto,
    req: AppRequest,
    res: Response,
  ) {
    return this.makeTransaction({
      action: async (session) => {
        const payment: PaymentType = await this.cuponService.getPayment({ ...paymentMethod, cuponCode });
        const organization = await this.findById({ id: organizationId, custom: this.organizationModel });
        return await this.create({
          dto: { ...dto, organization, payment, addon: addon ?? undefined },
          custom: addon ? this.addonModel : undefined,
          session,
        });
      },
      req,
      res,
      audit: {
        name: `request-${addon ? 'addon-' : ''}subscription`,
        module: EModule.Subscription,
        payload: { organizationId, cuponCode, addon, paymentMethod, ...dto },
      },
    });
  }
}
