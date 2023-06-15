import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Position } from './position.schema';
import { Type } from 'class-transformer';
import { OConfig } from 'src/organization/schema/o_config.schema';

export class CreatePositionDto extends PickType(Position, [
  'name',
  'shortName',
  'basicSalary',
  'isLateApprovable',
  'isOvertimeApprovable',
  'isLeaveApprovable',
  'remark',
  'allowedRoutes',
]) {
  @ValidateNested()
  @Type(() => OmitType(OConfig, ['_id', 'createdAt', 'updatedAt']))
  config?: Omit<OConfig, '_id' | 'createdAt' | 'updatedAt'>;
}

export class UpdatePositionDto extends PartialType(OmitType(Position, ['_id', 'createdAt', 'updatedAt'])) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
