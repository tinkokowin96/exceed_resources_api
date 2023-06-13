import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CuponCode } from '../schema/cupon_code.schema';

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
