import { OmitType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { Payment } from 'src/common/schema/common.schema';

export class GetPaymentDto extends OmitType(Payment, ['amount']) {
  @IsString()
  cuponCode: string;
}
