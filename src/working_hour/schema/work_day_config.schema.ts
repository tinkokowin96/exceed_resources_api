import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Compensation, Hour, TimeCompensation } from 'src/common/schema/common.schema';
import { EWeekDay } from 'src/common/util/enumn';

export class WorkDayConfig {
  @ValidateNested({ each: true })
  @Type(() => TimeCompensation)
  penalties?: TimeCompensation[];

  @IsBoolean()
  allowRemote?: boolean;

  @IsBoolean()
  requireCheckOut?: boolean;

  @ValidateNested()
  @Type(() => Hour)
  checkInTime?: Hour;

  @ValidateNested()
  @Type(() => Hour)
  checkOutTime?: Hour;

  @ValidateNested()
  @Type(() => Compensation)
  overtimeHourlyAllowance?: Compensation;

  @IsBoolean()
  allowLateSubstitute?: boolean;

  @IsBoolean()
  allowCustomBreak?: boolean;

  @IsBoolean()
  flexibleWorkingHour?: boolean;

  @IsNumber()
  numWorkingHour?: number;
}

export class WorkDay {
  @IsNotEmpty()
  @IsEnum(EWeekDay)
  day: EWeekDay;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WorkDayConfig)
  config: WorkDayConfig;
}
