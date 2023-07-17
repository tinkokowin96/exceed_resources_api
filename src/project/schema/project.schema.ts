import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/core/schema/core.shema';
import { Attachment } from 'src/core/schema/common.schema';
import { Collaborator } from './collaborator.schema';
import { Quotation } from './quotation.schema';
import { Task } from './task.schema';

@Schema()
export class Project extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: Number, default: 0 })
  @IsNumber()
  numNewTask: number;

  @Prop({ type: Number, default: 0 })
  @IsNumber()
  numProgressTask: number;

  @Prop({ type: Number, default: 0 })
  @IsNumber()
  numOverdueTask: number;

  @Prop({ type: Number, default: 0 })
  @IsNumber()
  numCompletedTask: number;

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => Attachment)
  attachments: Attachment[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Quotation' }] })
  quotations: Quotation[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Collaborator' }] })
  collaborators: Collaborator[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Task' }] })
  tasks: Task[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
