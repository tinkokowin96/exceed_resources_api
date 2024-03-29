import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { Attachment } from 'src/core/schema/common.schema';
import { CoreSchema } from 'src/core/schema/core.shema';
import { Collaborator } from './collaborator.schema';

@Schema()
export class Phase extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: Number })
  @IsNumber()
  expectedDuration: number;

  @Prop({ type: Date })
  @IsDateString()
  startDate: Date;

  @Prop({ type: Date })
  @IsDateString()
  endDate: Date;

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => Attachment)
  attachments: Attachment[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }] })
  role: Category[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Collaborator' }] })
  collaborators: Collaborator[];
}

export const PhaseSchema = SchemaFactory.createForClass(Phase);
