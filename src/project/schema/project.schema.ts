import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { AttachmentType, PayExtraType } from 'src/common/util/schema.type';
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

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Quotation' }] })
  @ValidateNested({ each: true })
  quotations: Quotation[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Collaborator' }] })
  @ValidateNested({ each: true })
  collaborators: Collaborator[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Task' }] })
  @ValidateNested({ each: true })
  tasks: Task[];

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  attachments: AttachmentType[];

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  reward: PayExtraType[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
