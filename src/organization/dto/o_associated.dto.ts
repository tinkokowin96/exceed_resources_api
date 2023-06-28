import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { AppOmit } from 'src/common/dto/core.dto';
import { LeaveAllowedDto } from 'src/leave/dto/leave.dto';
import { OAssociated } from '../schema/o_associated.schema';

export class CreateOAssociatedDto extends AppOmit(OAssociated, [
  'branch',
  'position',
  'departments',
  'leaves',
]) {
  @ValidateNested({ each: true })
  @Type(() => LeaveAllowedDto)
  leaveAllowed: LeaveAllowedDto[];

  @IsString()
  branchId?: string;

  @IsString()
  positionId?: string;

  @IsString()
  configId?: string;

  @IsString({ each: true })
  departmentIds?: string[];
}
