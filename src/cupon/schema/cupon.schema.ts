import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { PromotionAllowance } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';

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

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PromotionAllowance)
  allowance: PromotionAllowance;

  @Prop({ type: { type: SchemaTypes.ObjectId, ref: 'Category' } })
  category?: Category;
}

export const CuponSchema = SchemaFactory.createForClass(Cupon);
