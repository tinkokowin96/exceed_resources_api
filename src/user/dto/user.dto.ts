import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { FindDto } from 'src/common/dto/find.dto';
import { AddUserToDepartmentDto } from 'src/department/department.dto';
import { LeaveAllowedDto } from 'src/leave/dto/leave.dto';
import { CreateOAssociatedDto } from 'src/organization/dto/o_associated.dto';
import { OAssociated } from 'src/organization/schema/o_associated.schema';
import { User } from '../schema/user.schema';

export class CreateUserDto extends PickType(User, [
  'name',
  'image',
  'userName',
  'email',
  'password',
  'phone',
  'joiningDate',
  'accessErApp',
]) {
  @IsString()
  bankId: string;

  @IsString({ each: true })
  subscriptionIds: string[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateOAssociatedDto)
  orgainzationDto: CreateOAssociatedDto;
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
