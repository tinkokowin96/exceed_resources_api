import { OmitType } from '@nestjs/mapped-types';
import { Cupon } from '../schema/cupon.schema';
import { ArrayNotEmpty, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryDto } from 'src/common/dto/category.dto';
import { Payment } from 'src/common/schema/common.schema';

export class CreateCuponDto extends OmitType(Cupon, ['category', 'cuponCodes']) {
  @ValidateNested()
  @Type(() => CategoryDto)
  category?: CategoryDto;

  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsString({ each: true })
  cuponCodeIds: string[];
}

export class GetPaymentDto extends OmitType(Payment, ['amount']) {
  @IsString()
  cuponCode: string;
}
