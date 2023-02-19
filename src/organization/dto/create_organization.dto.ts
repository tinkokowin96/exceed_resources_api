import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { WorkingHourType } from 'src/common/util/schema.type';
import { Organization } from '../schema/organization.schema';

export class CreateOrganizationDto extends PickType(Organization, ['name', 'logo', 'attachments']) {
  @IsString()
  category: string;

  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @Type(() => WorkingHourType)
  @ValidateNested()
  @Type(() => WorkingHourType)
  checkInTime: WorkingHourType;

  @IsNotEmpty()
  @Type(() => WorkingHourType)
  @ValidateNested()
  @Type(() => WorkingHourType)
  checkOutTime: WorkingHourType;
}
