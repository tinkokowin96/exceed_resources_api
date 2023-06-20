import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { AppOmit } from 'src/common/dto/core.dto';
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

export class UpdatePositionDto extends PartialType(AppOmit(Position)) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
