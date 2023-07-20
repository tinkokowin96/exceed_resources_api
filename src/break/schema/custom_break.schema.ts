import { Prop, Schema } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import {
	AdjudicatedStatus,
	Counter,
	FieldValue,
	TimeCompensation,
} from 'src/core/schema/common.schema';
import { CoreSchema } from 'src/core/schema/core.shema';
import { ERequestStatus } from 'src/core/util/enumn';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class CustomBreak extends CoreSchema {
	@Prop({ type: Number, required: true })
	@IsNotEmpty()
	@IsNumber()
	proposedHour: number;

	//NOTE: this is overrall status
	@Prop({ type: String, enum: ERequestStatus, default: ERequestStatus.Pending })
	@IsEnum(ERequestStatus)
	status?: ERequestStatus;

	@Prop({ type: SchemaTypes.Mixed })
	@ValidateNested()
	@Type(() => Counter)
	breakTime?: Counter;

	@Prop({ type: SchemaTypes.Mixed })
	@ValidateNested()
	@Type(() => TimeCompensation)
	penalty?: TimeCompensation;

	@Prop({ type: [SchemaTypes.Mixed], required: true })
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => FieldValue)
	form: FieldValue[];

	/**
	 * NOTE: This is the approval status from each executive
	 * This is useful when needed to get approval from all PMs  of associated projects
	 */
	@Prop({ type: [SchemaTypes.Mixed] })
	@ValidateNested({ each: true })
	@Type(() => AdjudicatedStatus)
	adjudicatedStatus?: AdjudicatedStatus[];

	@Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
	lateToleratedBy?: User;
}
