import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { CoreSchema } from 'src/core/schema/core.shema';
import { Attachment } from 'src/core/schema/common.schema';
import { Collaborator } from './collaborator.schema';

@Schema()
export class Quotation extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  budget: number;

  @Prop({ type: Number })
  @IsNumber()
  expense: number;

  @Prop({ type: Number })
  @IsNumber()
  expectedManday: number;

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => Attachment)
  attachments: Attachment[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }] })
  roles: Category[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Collaborator' }] })
  collaborators: Collaborator[];
}

export const QuotationSchema = SchemaFactory.createForClass(Quotation);
