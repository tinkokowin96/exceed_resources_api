import { OmitType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FindDto } from 'src/common/dto/find.dto';
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
  'numEmployee',
  'subscriptionId',
]) {
  @IsString()
  cuponCode: string;
}

export class GetSubscriptionsDto extends FindDto {
  @IsString({ each: true })
  ids: string[];
}
