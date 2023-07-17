import { Prop, Schema } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { CoreSchema } from 'src/core/schema/core.shema';
import { AccumulatedLeave } from './accumulated_leave.schema';

@Schema()
export class PenalizedLeave extends CoreSchema {
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numDay: number;

  @Prop({ type: String })
  @IsString()
  remark?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  @IsNotEmpty()
  category: Category;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'AccumulatedLeave' })
  @IsNotEmpty()
  leave: AccumulatedLeave;
}
