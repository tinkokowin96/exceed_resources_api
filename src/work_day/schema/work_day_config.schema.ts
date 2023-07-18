import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, Max, Min, ValidateIf, ValidateNested } from 'class-validator';
import { Compensation, Hour, TimeCompensation } from 'src/core/schema/common.schema';
import { EWeekDay } from 'src/core/util/enumn';

export class WorkDayConfig {
  @IsNotEmpty()
  @IsBoolean()
  offDay: boolean;

  @ValidateNested({ each: true })
  @Type(() => TimeCompensation)
  latePenalties?: TimeCompensation[];

  @IsBoolean()
  allowRemote?: boolean;

  @IsBoolean()
  requireCheckOut?: boolean;

  @IsBoolean()
  flexibleWorkingHour?: boolean;

  @ValidateIf((object) => object.flexibleWorkingHour)
  @IsNotEmpty()
  @Min(3)
  @Max(20)
  numWorkingHour?: number;

  @ValidateIf((object) => !object.flexibleWorkingHour)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Hour)
  checkInTime?: Hour;

  @ValidateIf((object) => !object.flexibleWorkingHour)
  @IsNotEmpty()
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
