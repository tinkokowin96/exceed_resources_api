import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { FindDto } from 'src/common/dto/find.dto';
import { OAssociated } from 'src/organization/schema/o_associated.schema';
import { User } from '../schema/user.schema';
import { AddUserToDepartmentDto } from 'src/department/department.dto';

export class CreateUserDto extends IntersectionType(
  PickType(User, ['name', 'image', 'userName', 'email', 'password', 'phone', 'joiningDate', 'accessErApp']),
  OmitType(OAssociated, ['position', 'departments', 'branch']),
) {
  @IsString()
  bankId: string;

  @IsString()
  positionId: string;

  @IsNumber()
  basicSalary: number;

  @IsString()
  configId: string;

  //NOTE: This will accept if not logged in which mean owner account
  @IsString()
  organizationId: string;

  @IsString({ each: true })
  subscriptionIds: string[];

  @ValidateNested({ each: true })
  @Type(() => OmitType(AddUserToDepartmentDto, ['userId']))
  departments: Omit<AddUserToDepartmentDto, 'userId'>[];
}

export class LoginUserDto extends PartialType(PickType(User, ['userName', 'email'])) {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  erUser: boolean;
}

export class ToggleErAppAccessDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsBoolean()
  accessErApp: boolean;
}

export class ChangePasswordDto extends PickType(User, ['email', 'password']) {
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class GetUsersDto extends FindDto {
  @IsString()
  organizationId?: string;
}

export class AddAssociatedOrganizationDto {
  @IsNotEmpty()
  @IsString({ each: true })
  userIds: string[];

  @IsBoolean()
  isCurrentOrganization: boolean;

  @ValidateNested()
  @Type(() => OAssociated)
  orgainzation: OAssociated;
}
