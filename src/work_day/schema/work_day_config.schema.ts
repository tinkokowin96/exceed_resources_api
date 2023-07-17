import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Compensation, Hour, TimeCompensation } from 'src/core/schema/common.schema';
import { ETime, EWeekDay } from 'src/core/util/enumn';

export class WorkDayConfig {
  @IsNotEmpty()
  @IsBoolean()
  offDay: boolean;

  //TODO: need to valiate this must not empty if there is latePenalties
  @IsEnum(ETime)
  compensationUnit: ETime;

  @ValidateNested({ each: true })
  @Type(() => TimeCompensation)
  latePenalties?: TimeCompensation[];

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
  allowRemoteCheckIn?: boolean;

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
  @IsEnum(EWeekDay, { each: true })
  days: EWeekDay[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WorkDayConfig)
  config: WorkDayConfig;
}
