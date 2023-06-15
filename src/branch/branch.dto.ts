import { PickType } from '@nestjs/mapped-types';
import { Branch } from './branch.schema';
import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Organization } from 'src/organization/schema/organization.schema';

export class CreateBranchDto extends PickType(Branch, ['name', 'address', 'location', 'remark']) {
  @IsString()
  organizationId?: string;

  @IsString()
  configId?: string;

  @ValidateNested()
  @Type(() => Organization)
  organization: Organization;
}
