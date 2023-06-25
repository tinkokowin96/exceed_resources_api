import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { AppOmit } from 'src/common/dto/core.dto';
import { Position } from './position.schema';
import { Type } from 'class-transformer';
import { UpdateArray } from 'src/common/schema/common.schema';

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

export class UpdatePositionDto extends PartialType(AppOmit(Position, ['config', 'breaks'])) {
  @IsNotEmpty()
  @IsString()
  id: string;

  @ValidateNested({ each: true })
  @Type(() => UpdateArray)
  breaks?: UpdateArray[];

  @IsString()
  configId?: string;
}
