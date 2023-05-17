import { OmitType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { PaymentType } from 'src/common/util/schema.type';

export class GetPaymentDto extends OmitType(PaymentType, ['amount']) {
  @IsString()
  cuponCode: string;
}
