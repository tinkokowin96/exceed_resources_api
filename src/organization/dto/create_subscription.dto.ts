import { PickType } from '@nestjs/mapped-types';
import { Subscription } from '../schema/o_subscription.schema';

export class CreateSubscriptionDto extends PickType(Subscription, ['numDay', 'numEmployee']) {}
