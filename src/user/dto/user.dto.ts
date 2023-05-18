import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../schema/user.schema';

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

export class LoginUserDto extends PartialType(PickType(User, ['password', 'userName', 'email'])) {
  @IsString()
  organizationId: string;
}

export class ChangePasswordDto extends PickType(User, ['email', 'password']) {
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
