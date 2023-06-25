import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { FieldValue } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { ERequestStatus } from 'src/common/util/enumn';
import { User } from 'src/user/schema/user.schema';
import { AccumulatedLeave } from './accumulated_leave.schema';

@Schema()
export class ForfeitedLeave extends CoreSchema {
  @Prop({ type: SchemaTypes.Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numDay: number;

  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @Prop({ type: String, enum: ERequestStatus, default: ERequestStatus.Pending })
  @IsEnum(ERequestStatus)
  status?: ERequestStatus;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => FieldValue)
  form: FieldValue[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  @IsNotEmpty()
  approvedBy: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'AccumulatedLeave' })
  @IsNotEmpty()
  leave: AccumulatedLeave;
}

export const ForfeitedLeaveSchema = SchemaFactory.createForClass(ForfeitedLeave);
