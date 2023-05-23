import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { User } from '../schema/user.schema';
import { FindDto } from 'src/common/dto/find.dto';
import { OAssociated } from 'src/organization/schema/o_associated.schema';
import { Type } from 'class-transformer';

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
  @IsString({ each: true })
  organizationIds?: string[];

  @IsBoolean()
  chat?: boolean;
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
