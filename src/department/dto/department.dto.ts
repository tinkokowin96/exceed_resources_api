import { OmitType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Department } from '../schema/department.schema';

export class AddUserToDepartmentDto {
  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsBoolean()
  isHead: boolean;
}

export class CreateDepartmentDto extends OmitType(Department, ['head', 'colleagues', 'departments']) {
  @IsNotEmpty()
  @IsString()
  headId: string;

  @IsString({ each: true })
  childDepartmentIds: string[];
}
