import { Prop, Schema } from '@nestjs/mongoose';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { CoreSchema } from 'src/common/schema/core.shema';

@Schema()
export class PointTransaction extends CoreSchema {
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numPoint: number;

  @Prop({ type: Boolean, required: true })
  @IsNotEmpty()
  @IsBoolean()
  earning: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  @IsNotEmpty()
  category: Category;
}
