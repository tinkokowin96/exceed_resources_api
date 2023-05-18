import { OmitType } from '@nestjs/mapped-types';
import { Subscription } from 'src/er_app/subscription/schema/subscription.schema';

export class NewSubscriptionDto extends OmitType(Subscription, ['organization']) {}
