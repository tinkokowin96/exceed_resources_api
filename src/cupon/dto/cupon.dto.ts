import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { CategoryDto } from 'src/core/dto/category.dto';
import { Payment } from 'src/core/schema/common.schema';
import { Cupon } from '../schema/cupon.schema';

export class CreateCuponDto extends OmitType(Cupon, ['category']) {
  @ValidateNested()
  @Type(() => CategoryDto)
  category?: CategoryDto;
}

export class GetPaymentDto extends OmitType(Payment, ['amount']) {
  @IsString()
  cuponCodeId?: string;

  @IsString()
  promotionId?: string;
}
