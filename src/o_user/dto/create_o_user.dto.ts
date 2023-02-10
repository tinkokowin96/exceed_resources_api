import { OmitType } from '@nestjs/mapped-types';
import { IsBoolean, IsString } from 'class-validator';
import { OUser } from '../schema/o_user.schema';

export class CreateOUserDto extends OmitType(OUser, [
  'type',
  'status',
  'bank',
  'currentOrganization',
  'earnings',
  'deductions',
  'projects',
  'associatedOrganizations',
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
