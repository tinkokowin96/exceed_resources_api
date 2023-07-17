import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { Attachment } from 'src/core/schema/common.schema';
import { CoreSchema } from 'src/core/schema/core.shema';
import { Collaborator } from './collaborator.schema';
import { Phase } from './phase.schema';
import { Project } from './project.schema';
import { Quotation } from './quotation.schema';

@Schema()
export class Task extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  name: string;

  @Prop({ type: String })
  @IsString()
  description: string;

  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  assignedDate: Date;

  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  dueDate: Date;

  @Prop({ type: [String] })
  @IsString({ each: true })
  urls: string[];

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => Attachment)
  attachments: Attachment[];

  @Prop({ type: { type: SchemaTypes.ObjectId, ref: 'Category' } }) // need to validate here
  status: Category;

  @Prop({ type: { type: SchemaTypes.ObjectId, ref: 'Category' } }) // need to validate here
  priority: Category;

  @Prop({ type: { type: SchemaTypes.ObjectId, ref: 'Project' } })
  project: Project;

  @Prop({ type: { type: SchemaTypes.ObjectId, ref: 'Collaborator' } })
  assignedBy: Collaborator;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Collaborator' }] })
  assignedTo: Collaborator[];

  @Prop({ type: { type: SchemaTypes.ObjectId, ref: 'Phase' } })
  phase: Phase;

  @Prop({ type: { type: SchemaTypes.ObjectId, ref: 'Quotation' } })
  quotation: Quotation;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
