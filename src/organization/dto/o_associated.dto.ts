import { IsString, ValidateNested } from 'class-validator';
import { Branch } from 'src/branch/branch.schema';
import { AppOmit } from 'src/common/dto/core.dto';
import { OAssociated } from '../schema/o_associated.schema';
import { Position } from 'src/position/position.schema';
import { Type } from 'class-transformer';
import { Department } from 'src/department/department.schema';

export class CreateOAssociatedDto extends AppOmit(OAssociated, ['branch', 'position', 'departments']) {
  @ValidateNested()
  @Type(() => Branch)
  userBranch?: Branch;

  @IsString()
  branchId?: string;

  @ValidateNested()
  @Type(() => Position)
  userPosition?: Position;

  @IsString()
  positionId?: string;

  @ValidateNested({ each: true })
  @Type(() => Department)
  userDepartments?: Department[];

  @IsString({ each: true })
  departmentIds?: string[];
}
