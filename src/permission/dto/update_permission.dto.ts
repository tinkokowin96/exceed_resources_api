import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class UpdatePermissionType {
  @IsString({ each: true })
  add: string[];

  @IsString()
  remove: string;
}

export class UpdatePermissionDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => UpdatePermissionType)
  permissions: UpdatePermissionType;
}
