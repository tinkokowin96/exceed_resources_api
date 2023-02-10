import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { AttachmentType } from 'src/common/util/schema.type';
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

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }] })
  @ValidateNested({ each: true })
  roles: Category[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Collaborator' }] })
  @ValidateNested({ each: true })
  collaborators: Collaborator[];

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  attachments: AttachmentType[];
}

export const QuotationSchema = SchemaFactory.createForClass(Quotation);
