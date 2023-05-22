import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../schema/user.schema';
import { FindDto } from 'src/common/dto/find.dto';

export class CreateUserDto extends PickType(User, [
  'name',
  'image',
  'userName',
  'email',
  'password',
  'phone',
  'joiningDate',
]) {
  @IsString()
  bankId: string;

  @IsBoolean()
  accessUserApp: boolean;

  @IsString()
  currentOrganizationId: string;

  @IsString({ each: true })
  projectIds: string[];

  @IsString({ each: true })
  associatedOrganizationIds: string[];
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
  @IsBoolean()
  erAppUsers: boolean;

  @IsString()
  organizationId: string;

  @IsBoolean()
  oAdminAppUsers: boolean;
}
