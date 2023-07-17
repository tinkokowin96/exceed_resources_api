import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDateString, IsIP, IsNumber, IsString } from 'class-validator';
import { CoreSchema } from './core.shema';

@Schema()
export class ExceedLimit extends CoreSchema {
  @Prop({ type: String })
  @IsIP()
  address: string;

  @Prop({ type: String })
  @IsString()
  userId: string;

  @Prop({ type: Date, required: true })
  @IsDateString()
  lastExceedTime: Date;

  @Prop({ type: Date })
  @IsDateString()
  blockedTime: Date;

  @Prop({ type: Number, default: 0 })
  @IsNumber()
  numAttempt: number;

  @Prop({ type: Number, default: 0 })
  @IsNumber()
  numAttemptHalfDayBlock: number;

  @Prop({ type: Number, default: 0 })
  @IsNumber()
  numAttemptOneDayBlock: number;

  @Prop({ type: Number, default: 0 })
  @IsNumber()
  numAttemptThreeDayBlock: number;

  @Prop({ type: Number, default: 0 })
  @IsNumber()
  blockedDay: number;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  blockedForever: boolean;
}

export const ExceedLimitSchema = SchemaFactory.createForClass(ExceedLimit);
