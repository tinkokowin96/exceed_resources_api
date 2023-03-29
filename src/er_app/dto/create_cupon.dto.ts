import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CategoryDto } from 'src/common/dto/category.dto';
import { Cupon } from '../schema/cupon.schema';
import { CuponCode } from '../schema/cupon_code.schema';

export class CreateCuponDto extends OmitType(Cupon, ['type', 'cuponCodes']) {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @IsString({ each: true })
  cuponCodeIds: string[];
}

export class CreateCuponCodeDto extends CuponCode {}

export class UpdateCuponCodeType {
  @IsNotEmpty()
  @IsString()
  codeId: string;

  @IsNotEmpty()
  @IsBoolean()
  add: boolean;
}

export class UpdateCuponCodeDto {
  @IsNotEmpty()
  @IsString()
  cuponId: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateCuponCodeType)
  codes: UpdateCuponCodeType[];
}
