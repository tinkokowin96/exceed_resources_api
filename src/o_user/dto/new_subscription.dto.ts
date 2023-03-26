import { OmitType } from '@nestjs/mapped-types';
import { Subscription } from 'src/organization/schema/o_subscription.schema';

export class NewSubscriptionDto extends OmitType(Subscription, ['addons', 'organization']) {}
