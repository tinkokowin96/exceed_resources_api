import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { AddonSubscription } from './schema/addon_subscription.schema';
import { Subscription } from './schema/subscription.schema';

@Injectable()
export class OSubscriptionService extends CoreService {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Subscription.name) model: Model<Subscription>,
    @InjectModel(AddonSubscription.name) addonModel: Model<AddonSubscription>,
  ) {
    super(connection, model);
  }

  //   async requestSubscription()
}
