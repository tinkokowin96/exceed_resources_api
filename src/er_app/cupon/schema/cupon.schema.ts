import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { CuponCode } from './cupon_code.schema';

@Schema()
export class Cupon extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: Date })
  @IsDateString()
  active_until?: Date;

  @Prop({ type: Boolean, default: true })
  @IsNumber()
  active?: boolean;

  @Prop({ type: Number })
  @IsNumber()
  activeOnAmount?: number;

  @Prop({ type: String })
  @IsString()
  remark?: string;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  allowanceAmount: number;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsBoolean()
  isPercentage: boolean;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'CuponCode' }] })
  @IsNotEmpty()
  cuponCodes: CuponCode[];

  @Prop({ type: { type: SchemaTypes.ObjectId, ref: 'Category' } })
  category?: Category;
}

export const CuponSchema = SchemaFactory.createForClass(Cupon);
