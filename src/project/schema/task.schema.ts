import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { AttachmentType, PayExtraType } from 'src/common/util/schema.type';
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

  @Prop({ type: { type: SchemaTypes.ObjectId, ref: 'Category' } }) // need to validate here
  @ValidateNested()
  status: Category;

  @Prop({ type: { type: SchemaTypes.ObjectId, ref: 'Category' } }) // need to validate here
  @ValidateNested()
  priority: Category;

  @Prop({ type: { type: SchemaTypes.ObjectId, ref: 'Project' } })
  @ValidateNested()
  project: Project;

  @Prop({ type: { type: SchemaTypes.ObjectId, ref: 'Collaborator' } })
  @ValidateNested()
  assignedBy: Collaborator;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Collaborator' }] })
  @ValidateNested({ each: true })
  assignedTo: Collaborator[];

  @Prop({ type: { type: SchemaTypes.ObjectId, ref: 'Phase' } })
  @ValidateNested()
  phase: Phase;

  @Prop({ type: { type: SchemaTypes.ObjectId, ref: 'Quotation' } })
  @ValidateNested()
  quotation: Quotation;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  attachments: AttachmentType[];

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  reward: PayExtraType[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
