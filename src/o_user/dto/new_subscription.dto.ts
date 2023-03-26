import { OmitType } from '@nestjs/mapped-types';
import { OSubscription } from 'src/organization/schema/o_subscription.schema';

export class NewSubscriptionDto extends OmitType(OSubscription, ['addons', 'organization']) {}
