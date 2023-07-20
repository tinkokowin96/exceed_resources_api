import { Type } from 'class-transformer';
import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	Max,
	Min,
	ValidateIf,
	ValidateNested,
} from 'class-validator';
import { Compensation, Hour } from 'src/core/schema/common.schema';
import { EWeekDay } from 'src/core/util/enumn';

export class WorkDayConfig {
	@IsNotEmpty()
	@IsBoolean()
	offDay: boolean;

	// @IsNotEmpty()
	// @IsBoolean()
	// requireCBApprove: boolean;

	@ValidateNested({ each: true })
	@Type(() => Compensation)
	latePenalties?: Compensation[];

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
