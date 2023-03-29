import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { ExtraType } from 'src/common/util/schema.type';
import { CuponCode } from './cupon_code.schema';

@Schema()
export class Cupon extends CoreSchema {
  @Prop({ type: String })
  @IsString()
  name: string;

  @Prop({ type: Date })
  @IsDateString()
  active_until: Date;

  @Prop({ type: Boolean, default: true })
  @IsNumber()
  active: boolean;

  @Prop({ type: Number })
  @IsNumber()
  activeOnAmount: number;

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ExtraType)
  allowance: ExtraType;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'CuponCode' }] })
  @ValidateNested({ each: true })
  @Type(() => CuponCode)
  cuponCodes: CuponCode[];

  @Prop({ type: { type: SchemaTypes.ObjectId, ref: 'Category' } })
  @ValidateNested()
  @Type(() => Category)
  type: Category;
}

export const CuponSchema = SchemaFactory.createForClass(Cupon);
