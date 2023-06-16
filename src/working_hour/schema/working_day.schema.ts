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

export class WorkingDay {
  @IsNotEmpty()
  @IsEnum(EWeekDay)
  day: EWeekDay;

  @ValidateNested({ each: true })
  @Type(() => LatePenalty)
  penalties?: LatePenalty[];

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
