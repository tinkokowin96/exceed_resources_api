import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Position } from '../schema/position.schema';

import { Type } from 'class-transformer';
import { CreatePermissionDto } from 'src/permission/dto/permission.dto';

export class CreatePositionDto extends OmitType(Position, ['permission', '_id', 'createdAt', 'updatedAt']) {
  @ValidateNested()
  @Type(() => OmitType(CreatePermissionDto, ['name']))
  permissionDto?: Omit<CreatePermissionDto, 'name'>;

  @IsString()
  permissionName?: string;
}

export class UpdatePositionDto extends PartialType(OmitType(Position, ['_id', 'createdAt', 'updatedAt'])) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
