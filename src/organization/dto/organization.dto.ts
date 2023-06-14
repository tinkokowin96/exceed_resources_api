import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CategoryDto } from 'src/common/dto/category.dto';
import { Hour } from 'src/common/schema/common.schema';
import { Organization } from '../schema/organization.schema';

export class CreateOrganizationDto extends PickType(Organization, ['name', 'logo', 'attachments']) {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Hour)
  checkInTime: Hour;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Hour)
  checkOutTime: Hour;
}
