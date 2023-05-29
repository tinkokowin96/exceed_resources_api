import { PickType } from '@nestjs/mapped-types';
import { ArrayNotEmpty, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Permission } from '../permission.schema';
import { Type } from 'class-transformer';

export class CreatePermissionDto extends PickType(Permission, ['name', 'allowedRoutes']) {
  @IsString({ each: true })
  assignableRoleIds: string[];
}

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
