import { PartialType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { AppOmitWithExtra } from 'src/common/dto/core.dto';
import { UpdateArray } from 'src/common/schema/common.schema';
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

export class UpdatePositionDto extends PartialType(AppOmitWithExtra(Position, ['config', 'breaks'])) {
  @IsNotEmpty()
  @IsString()
  id: string;

  @ValidateNested({ each: true })
  @Type(() => UpdateArray)
  breakIds: UpdateArray[];

  @IsString()
  configId?: string;
}
