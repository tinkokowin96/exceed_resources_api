import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { Permission } from '../permission.schema';

export class CreatePermissionDto extends PickType(Permission, ['name', 'allowedRoutes']) {
  @IsNotEmpty()
  @IsString({ each: true })
  assignableRoleIds: string[];

  @IsString()
  companyId: string;
}
