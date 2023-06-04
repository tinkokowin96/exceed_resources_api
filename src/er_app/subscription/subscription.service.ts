import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { Subscription } from './schema/subscription.schema';

@Injectable()
export class SubscriptionService extends CoreService<Subscription> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Subscription.name) model: Model<Subscription>,
  ) {
    super(connection, model);
  }
}
