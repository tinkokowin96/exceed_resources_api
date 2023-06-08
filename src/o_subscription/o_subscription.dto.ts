import { OmitType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Payment } from 'src/common/schema/common.schema';
import { OSubscription } from './o_subscription.schema';
import { FindDto } from 'src/common/dto/find.dto';

export class CreateOSubscriptionDto extends OmitType(OSubscription, [
  'status',
  'organization',
  'payment',
  'active',
  'activeUntil',
  'subscription',
]) {
  @IsString()
  @IsNotEmpty()
  subscriptionId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OmitType(Payment, ['amount']))
  payment: Omit<Payment, 'amount'>;

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
