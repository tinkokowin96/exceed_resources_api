import { OmitType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Payment } from 'src/common/schema/common.schema';
import { SubscriptionRequest } from '../schema/subscription_request.schema';

export class RequestSubscriptionDto extends OmitType(SubscriptionRequest, [
  'status',
  'organization',
  'payment',
  'active',
  'activeUntil',
  'subscription',
  'addonSubscription',
]) {
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @IsString()
  subscriptionId: string;

  @IsString()
  addonSubscriptionId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OmitType(Payment, ['amount']))
  payment: Omit<Payment, 'amount'>;

  @IsString()
  cuponCode: string;
}

export class CalculatePriceDto extends PickType(RequestSubscriptionDto, [
  'numDay',
  'numEmployee',
  'subscriptionId',
  'addonSubscriptionId',
  'payment',
]) {}
