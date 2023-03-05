import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Field } from 'src/common/schema/field.schema';

@Schema()
export class SalaryCategory {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  effectiveDate: Date;

  @Prop({ type: Boolean, required: true })
  @IsNotEmpty()
  @IsBoolean()
  earning: boolean;

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Field' }] })
  fields: Field[];
}

export const SalaryCategorySchema = SchemaFactory.createForClass(SalaryCategory);
