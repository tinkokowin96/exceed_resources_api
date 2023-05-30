import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CoreSchema } from 'src/common/schema/core.shema';

@Schema()
export class Position extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String, required: true })
  @IsString()
  shortName: string;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  basicSalary: number;

  @Prop({ type: String })
  @IsString()
  remark?: string;

  @Prop({ type: [String], default: [] })
  @IsString({ each: true })
  allowedRoutes?: string[];
}

export const PositionSchema = SchemaFactory.createForClass(Position);
