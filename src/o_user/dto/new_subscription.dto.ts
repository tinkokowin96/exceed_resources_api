import { OmitType } from '@nestjs/mapped-types';
import { CompanySubscription } from '@schema/company_subscription.schema';

export class NewSubscriptionDto extends OmitType(CompanySubscription, [
    'status',
]) {}
