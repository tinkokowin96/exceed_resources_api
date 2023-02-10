import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CoreSchema } from 'src/common/schema/core.shema';

@Schema()
export class Voucher extends CoreSchema {
  @Prop({ type: String })
  @IsString()
  name: string;

  @Prop({ type: [String], required: true })
  @IsNotEmpty()
  @IsString({ each: true })
  voucherCode: string[];

  @Prop({ type: Date })
  @IsDateString()
  active_until: Date;

  @Prop({ type: Boolean, default: true })
  @IsNumber()
  absolute: boolean;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @Prop({ type: Boolean, default: true })
  @IsNumber()
  active: boolean;

  @Prop({ type: Number })
  @IsNumber()
  activeOnAmount: number;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numVoucher: number;

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: { type: SchemaTypes.ObjectId, ref: 'Category' } })
  @ValidateNested()
  type: Category;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
