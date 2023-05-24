import { OmitType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Department } from '../schema/department.schema';

export class DepartmentDto {
  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @IsNotEmpty()
  @IsBoolean()
  head: boolean;
}

export class CreateDepartmentDto extends OmitType(Department, ['head', 'colleagues', 'departments']) {
  @IsNotEmpty()
  @IsString()
  headId: string;

  @IsString({ each: true })
  childDepartmentIds: string[];
}
