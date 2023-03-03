import { PickType } from '@nestjs/mapped-types';
import { OSubscription } from '../schema/o_subscription.schema';

export class CreateSubscriptionDto extends PickType(OSubscription, ['numMonth', 'numEmployee']) {}
