import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { EAddon } from 'src/common/util/enumn';
import { PaymentType } from 'src/common/util/schema.type';
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
  @Type(() => OmitType(PaymentType, ['amount']))
  payment: Omit<PaymentType, 'amount'>;

  @IsString()
  cuponCode: string;

  @IsEnum(EAddon)
  addon: EAddon;
}
