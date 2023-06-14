import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNumber, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Field } from 'src/common/schema/field.schema';

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
  remark: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Field' }] })
  form: Field[];
}

export const LeaveSchema = SchemaFactory.createForClass(Leave);
