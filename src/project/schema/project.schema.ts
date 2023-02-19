import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
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

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => AttachmentType)
  attachments: AttachmentType[];

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => PayExtraType)
  reward: PayExtraType[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Quotation' }] })
  @ValidateNested({ each: true })
  @Type(() => Quotation)
  quotations: Quotation[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Collaborator' }] })
  @ValidateNested({ each: true })
  @Type(() => Collaborator)
  collaborators: Collaborator[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Task' }] })
  @ValidateNested({ each: true })
  @Type(() => Task)
  tasks: Task[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
