import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Extra, Hour } from 'src/common/schema/common.schema';
import { EWeekDay } from 'src/common/util/enumn';

export class LatePenalty {
  @IsNotEmpty()
  @IsNumber()
  numMinute: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Extra)
  penalty: Extra;
}

export class WorkDayConfig {
  @ValidateNested({ each: true })
  @Type(() => LatePenalty)
  penalties?: LatePenalty[];

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
  @Type(() => Extra)
  overtimeHourlyAllowance?: Extra;

  @IsBoolean()
  allowLateSubstitute?: boolean;

  @IsBoolean()
  allowUserBreak?: boolean;

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
