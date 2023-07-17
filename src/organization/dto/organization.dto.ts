import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CategoryDto } from 'src/core/dto/category.dto';
import { OConfig } from '../schema/o_config.schema';
import { Organization } from '../schema/organization.schema';
import { Branch } from 'src/branch/branch.schema';

export class CreateOrganizationDto extends IntersectionType(
  PickType(OConfig, ['overtimeForm']),
  PickType(Organization, ['name', 'logo', 'attachments']),
  PickType(Branch, ['address', 'location', 'remark']),
) {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @IsString()
  mainBranchName?: string;
}
