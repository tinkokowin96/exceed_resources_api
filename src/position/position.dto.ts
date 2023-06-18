import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { Position } from './position.schema';

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
  @IsString()
  configId?: string;
}

export class UpdatePositionDto extends PartialType(OmitType(Position, ['_id', 'createdAt', 'updatedAt'])) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
