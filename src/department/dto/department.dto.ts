import { OmitType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Department } from '../schema/department.schema';

export class CreateDepartmentDto extends OmitType(Department, ['head', 'departments']) {
  @IsNotEmpty()
  @IsString()
  headId: string;

  @IsString({ each: true })
  childDepartmentIds: string[];
}

export class AddUserToDepartmentDto {
  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsBoolean()
  isHead: string;
}

export class ChangeDepartmentHeadDto extends OmitType(AddUserToDepartmentDto, ['isHead']) {}
