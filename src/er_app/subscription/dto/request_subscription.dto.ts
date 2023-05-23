import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { EAddon } from 'src/common/util/enumn';
import { Payment } from 'src/common/schema/common.schema';
import { SubscriptionRequest } from '../schema/subscription_request.schema';

export class RequestSubscriptionDto extends OmitType(SubscriptionRequest, [
  'cupon',
  'organization',
  'payment',
]) {
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OmitType(Payment, ['amount']))
  payment: Omit<Payment, 'amount'>;

  @IsString()
  cuponCode: string;

  @IsEnum(EAddon)
  addon: EAddon;
}
