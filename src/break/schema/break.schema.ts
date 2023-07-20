import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Branch } from 'src/branch/branch.schema';
import { Compensation } from 'src/core/schema/common.schema';
import { CoreSchema } from 'src/core/schema/core.shema';
import { ETime } from 'src/core/util/enumn';

export class Break extends CoreSchema {
	@Prop({ type: String, required: true })
	@IsNotEmpty()
	@IsString()
	name: string;

	@Prop({ type: Number, required: true })
	@IsNotEmpty()
	@IsNumber()
	allowedMinutes: number;

	@Prop({ type: String, enum: ETime, required: true })
	@IsNotEmpty()
	@IsEnum(ETime)
	compensationUnit: ETime;

	@Prop({ type: Boolean, default: false })
	@IsBoolean()
	takeAnyTime?: boolean;

	@Prop({ type: Boolean, default: false })
	@IsBoolean()
	autoFinish?: boolean;

	@Prop({ type: Number })
	@IsNumber()
	startTime?: number;

	@Prop({ type: Number })
	@IsNumber()
	lateTolerance?: number;

	@Prop({ type: SchemaTypes.Mixed })
	@ValidateNested({ each: true })
	@Type(() => Compensation)
	penalties: Compensation[];

	@Prop({ type: SchemaTypes.ObjectId, ref: 'Branch', required: true })
	@IsNotEmpty()
	branch: Branch;
}

export const BreakSchema = SchemaFactory.createForClass(Break);
