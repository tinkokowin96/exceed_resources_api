import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { OSubscription } from '../schema/o_subscription.schema';

@Injectable()
export class SubscriptionService extends CoreService {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(OSubscription.name) model: Model<OSubscription>,
  ) {
    super(connection, model);
  }

  async createSubscription(dto);
}
