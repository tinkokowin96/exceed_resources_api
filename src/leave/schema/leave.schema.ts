import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Field } from 'src/common/schema/field.schema';
import { AccumulatedLeave } from './accumulated_leave.schema';
import { ForfeitedLeave } from './forfeited_leave.schema';

export class NumAllowedPerTenure {
  @IsNotEmpty()
  @IsNumber()
  numAllowed: number;

  @IsNotEmpty()
  @IsNumber()
  tenure: number;
}

export class LeaveAllowed {
  @ValidateNested({ each: true })
  @Type(() => NumAllowedPerTenure)
  numAllowed: NumAllowedPerTenure[];

  @IsNotEmpty()
  @IsMongoId()
  leave: Leave;
}

export class AllocatedLeave {
  @IsNotEmpty()
  @IsMongoId({ each: true })
  accumulatedLeaves: AccumulatedLeave[];

  @IsNotEmpty()
  @IsMongoId({ each: true })
  forfeitedLeaves: ForfeitedLeave[];

  @IsNotEmpty()
  @IsMongoId()
  leave: Leave;
}

@Schema()
export class Leave extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsString()
  name: boolean;

  @Prop({ type: Number, required: true })
  @IsNumber()
  numAllowed: number;

  @Prop({ type: String })
  @IsString()
  remark?: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Field' }] })
  form: Field[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  category?: Category;
}

export const LeaveSchema = SchemaFactory.createForClass(Leave);
