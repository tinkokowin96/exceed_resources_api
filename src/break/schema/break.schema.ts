import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CoreSchema } from 'src/common/schema/core.shema';

export class Break extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  endName: string;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  allowedHour: number;

  @Prop({ type: Boolean, default: false })
  @IsNumber()
  takeAnyTime: number;

  @Prop({ type: Number })
  @IsNumber()
  startTime: number;
}

export const BreakSchema = SchemaFactory.createForClass(Break);
