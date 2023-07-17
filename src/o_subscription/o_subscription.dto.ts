import { IntersectionType, OmitType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FindDto } from 'src/core/dto/find.dto';
import { OSubscription } from './o_subscription.schema';

export class CreateOSubscriptionDto extends OmitType(OSubscription, [
  'status',
  'organization',
  'payment',
  'active',
  'activeUntil',
  'subscription',
  'isAddon',
]) {
  @IsString()
  @IsNotEmpty()
  subscriptionId: string;

  @IsNotEmpty()
  @IsNumber()
  payAmount: number;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @IsNotEmpty()
  @IsString()
  paymentProof: string;

  @IsString()
  cuponCode: string;
}

export class CalculatePriceDto extends PickType(CreateOSubscriptionDto, [
  'numDay',
  'numSlot',
  'subscriptionId',
]) {
  @IsString()
  cuponCode: string;
}

export class GetSubscriptionsDto extends IntersectionType(FindDto, PickType(OSubscription, ['status'])) {
  @IsString()
  organizationId: string;
}
