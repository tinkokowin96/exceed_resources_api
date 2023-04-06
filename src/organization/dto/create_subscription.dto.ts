import { PickType } from '@nestjs/mapped-types';
import { Subscription } from 'src/subscription/schema/subscription.schema';

export class CreateSubscriptionDto extends PickType(Subscription, ['numDay', 'numEmployee']) {}
