import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import {
	IsBoolean,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsString,
	Max,
	Min,
	ValidateNested,
} from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { CoreSchema } from 'src/core/schema/core.shema';
import { Field } from 'src/core/schema/field.schema';
import { AccumulatedLeave } from './accumulated_leave.schema';
import { ForfeitedLeave } from './forfeited_leave.schema';
import { Position } from 'src/position/position.schema';

export class NumAllowedPerTenure {
	@IsNotEmpty()
	@IsNumber()
	numAllowed: number;

	@IsNotEmpty()
	@IsNumber()
	tenure: number;
}

export class LeaveAllowed {
	@ValidateNested({ each: true })
	@Type(() => NumAllowedPerTenure)
	numAllowed: NumAllowedPerTenure[];

	@IsNotEmpty()
	@IsMongoId()
	leave: Leave;
}

export class AllocatedLeave {
	@IsNotEmpty()
	@IsMongoId({ each: true })
	accumulatedLeaves: AccumulatedLeave[];

	@IsNotEmpty()
	@IsMongoId({ each: true })
	forfeitedLeaves: ForfeitedLeave[];

	@IsNotEmpty()
	@IsMongoId()
	leave: Leave;
}

@Schema()
export class Leave extends CoreSchema {
	@Prop({ type: String, required: true })
	@IsString()
	name: boolean;

	@Prop({ type: Number, required: true })
	@IsNotEmpty()
	@Min(0)
	@Max(100)
	carryOverLimt: number;

	@Prop({ type: Number, required: true })
	@IsNotEmpty()
	@IsNumber()
	rolloverPeriod: number;

	@Prop({ type: Boolean, required: true })
	@IsNotEmpty()
	@IsBoolean()
	isCashable: boolean;

	//NOTE: this is non-nullable if isCashable is true
	@Prop({ type: Number })
	@IsNumber()
	monetaryValue?: number;

	@Prop({ type: String })
	@IsString()
	remark?: string;

	//requireApproveFromAllAssociatedProject'sPosition
	@Prop({ type: Boolean, required: true })
	@IsNotEmpty()
	@IsBoolean()
	requireApproveFromAAPP: boolean;

	@Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Field' }] })
	@IsNotEmpty()
	form: Field[];

	@Prop({ type: SchemaTypes.ObjectId, ref: 'Position' })
	approverPositon?: Position;

	@Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
	category?: Category;
}

export const LeaveSchema = SchemaFactory.createForClass(Leave);
