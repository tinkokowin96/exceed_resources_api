import { Type } from 'class-transformer';
import { IsBoolean, IsMongoId, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { WorkingHour } from 'src/common/schema/common.schema';
import { Organization } from './organization.schema';
import { Position } from 'src/position/schema/position.schema';
import { Break } from 'src/break/schema/break.schema';
import { Department } from 'src/department/schema/department.schema';

//NOTE: flexibleworkinghour, checkin, checkout and break will null for non custom(use value from config)

export class OAssociated {
  @IsNotEmpty()
  @IsBoolean()
  accessOAdminApp: boolean;

  @IsBoolean()
  flexibleWorkingHour: boolean;

  @IsString()
  remark: string;

  @ValidateNested()
  @Type(() => WorkingHour)
  checkInTime: WorkingHour;

  @ValidateNested()
  @Type(() => WorkingHour)
  checkOutTime: WorkingHour;

  @IsNotEmpty()
  @IsMongoId()
  organization: Organization;

  @IsNotEmpty()
  @IsMongoId()
  position: Position;

  @IsMongoId({ each: true })
  breaks: Break[];

  @IsMongoId({ each: true })
  departments: Department[];
}
