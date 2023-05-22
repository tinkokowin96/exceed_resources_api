import { Type } from 'class-transformer';
import { IsBoolean, IsMongoId, IsString, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { WorkingHourType } from 'src/common/util/schema.type';

//NOTE: flexibleworkinghour, checkin, checkout and break will null for non custom(use value from config)

export class OAssociated {
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

  @IsMongoId()
  organization: Types.ObjectId;

  @IsMongoId()
  position: Types.ObjectId;

  @IsMongoId({ each: true })
  breaks: Types.ObjectId[];

  @IsMongoId({ each: true })
  departments: Types.ObjectId[];

  @IsMongoId({ each: true })
  lates: Types.ObjectId[];

  @IsMongoId({ each: true })
  overtimes: Types.ObjectId[];

  @IsMongoId({ each: true })
  leaves: Types.ObjectId[];
}
