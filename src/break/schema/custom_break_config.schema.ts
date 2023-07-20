import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { Prop, Schema } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Branch } from 'src/branch/branch.schema';
import { TimeCompensation } from 'src/core/schema/common.schema';
import { CoreSchema } from 'src/core/schema/core.shema';
import { Leave } from 'src/leave/schema/leave.schema';

@Schema()
export class CustomBreakConfig extends IntersectionType(
	CoreSchema,
	PickType(Leave, ['approverPositon', 'requireApproveFromAAPP', 'form']),
) {
	@Prop({ type: Boolean, required: true })
	@IsNotEmpty()
	@IsBoolean()
	penaltizeOnExceedProposed: boolean;

	@Prop({ type: Number })
	@IsNumber()
	maxAllowedHour?: number;

	@Prop({ type: SchemaTypes.Mixed })
	@ValidateNested({ each: true })
	@Type(() => TimeCompensation)
	latePenalties?: TimeCompensation[];

	@Prop({ type: SchemaTypes.ObjectId, ref: 'Branch', required: true })
	@IsNotEmpty()
	branch: Branch;
}
