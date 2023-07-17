import { Prop, Schema } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Counter, TimeCompensation } from 'src/core/schema/common.schema';
import { CoreSchema } from 'src/core/schema/core.shema';
import { ERequestStatus, ETime } from 'src/core/util/enumn';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class CustomBreak extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  description: string;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  proposedMinutes: number;

  @Prop({ type: String, enum: ERequestStatus, required: true })
  @IsNotEmpty()
  @IsEnum(ERequestStatus)
  status: ERequestStatus;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Counter)
  breakTime: Counter;

  @Prop({ type: String, enum: ETime, required: true })
  @IsNotEmpty()
  @IsEnum(ETime)
  compensationUnit: ETime;

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested()
  @Type(() => TimeCompensation)
  penalty: TimeCompensation;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  adjudicatedBy: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  penalizedBy: User;
}
