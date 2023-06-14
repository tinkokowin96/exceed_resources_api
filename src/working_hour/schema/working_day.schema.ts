import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Hour } from 'src/common/schema/common.schema';
import { EWeekDay } from 'src/common/util/enumn';

export class WorkingDay {
  @IsNotEmpty()
  @IsEnum(EWeekDay)
  day: EWeekDay;

  @IsBoolean()
  allowRemote?: boolean;

  @ValidateNested()
  @Type(() => Hour)
  checkInTime?: Hour;

  @ValidateNested()
  @Type(() => Hour)
  checkOutTime?: Hour;

  @IsBoolean()
  flexibleWorkingHour?: boolean;

  @IsNumber()
  numWorkingHour?: number;
}
