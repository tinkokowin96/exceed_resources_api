import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { WorkingHourType } from 'src/common/util/schema.type';
import { Organization } from '../schema/organization.schema';

export class CreateOrganizationDto extends PickType(Organization, ['name', 'logo', 'attachments']) {
  @IsString()
  category: string;

  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @ValidateNested()
  checkInTime: WorkingHourType;

  @IsNotEmpty()
  @ValidateNested()
  checkOutTime: WorkingHourType;
}
