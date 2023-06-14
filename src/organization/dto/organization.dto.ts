import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CategoryDto } from 'src/common/dto/category.dto';
import { OConfig } from '../schema/o_config.schema';
import { Organization } from '../schema/organization.schema';

export class CreateOrganizationDto extends IntersectionType(
  PickType(OConfig, ['workingDays', 'overtimeForm']),
  PickType(Organization, ['name', 'logo', 'attachments']),
) {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;
}
