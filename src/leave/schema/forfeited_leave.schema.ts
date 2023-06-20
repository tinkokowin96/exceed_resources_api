import { PickType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Compensation, FieldValue } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { ERequestStatus } from 'src/common/util/enumn';
import { User } from 'src/user/schema/user.schema';

class LeavePenalty extends PickType(Compensation, ['isPoint', 'amount']) {
  @IsNotEmpty()
  @IsEnum(['Percentage', 'Absolute', 'BaseSalaryPercentage'])
  type: 'Percentage' | 'Absolute' | 'BaseSalaryPercentage';
}

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

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested()
  @Type(() => LeavePenalty)
  penalty: LeavePenalty;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => FieldValue)
  form: FieldValue[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  adjudicatedBy: User;
}

export const ForfeitedLeaveSchema = SchemaFactory.createForClass(ForfeitedLeave);
