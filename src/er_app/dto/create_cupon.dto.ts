import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CategoryDto } from 'src/common/dto/category.dto';
import { Cupon } from '../schema/cupon.schema';

export class CreateCuponDto extends OmitType(Cupon, ['type']) {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;
}
