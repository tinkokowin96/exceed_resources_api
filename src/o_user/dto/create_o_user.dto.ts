import { OmitType } from '@nestjs/mapped-types';
import { IsBoolean, IsDateString, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { OUser } from '../schema/o_user.schema';

export class CreateOwnerDto extends OmitType(OUser, ['type', 'loggedIn']) {
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
}

export class CreateEmployeeDto extends OUser {
  @IsNotEmpty()
  @IsDateString()
  joiningDate: Date;

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
