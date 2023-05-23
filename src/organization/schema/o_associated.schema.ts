import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { WorkingHourType } from 'src/common/util/schema.type';

//NOTE: flexibleworkinghour, checkin, checkout and break will null for non custom(use value from config)

export class OAssociated {
  @IsNotEmpty()
  @IsBoolean()
  accessAdminApp: boolean;

  @IsBoolean()
  flexibleWorkingHour: boolean;

  @IsString()
  remark: string;

  @ValidateNested()
  @Type(() => WorkingHourType)
  checkInTime: WorkingHourType;

  @ValidateNested()
  @Type(() => WorkingHourType)
  checkOutTime: WorkingHourType;

  @IsString()
  organizationId: string;

  @IsString()
  organizationName: string;

  @IsString()
  positionId: string;

  @IsString()
  positionName: string;

  @IsString({ each: true })
  breaks: string[];

  @IsString({ each: true })
  departments: string[];
}
