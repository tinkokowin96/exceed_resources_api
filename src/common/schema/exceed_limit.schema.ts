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
  lastLimitTime: Date;

  @Prop({ type: Date })
  @IsDateString()
  blockedTime: Date;

  @Prop({ type: Number, default: 1 })
  @IsNumber()
  numLimit: number;

  @Prop({ type: Number, default: 0 })
  @IsNumber()
  blockedDay: number;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  blockedForever: number;
}

export const ExceedLimitSchema = SchemaFactory.createForClass(ExceedLimit);
