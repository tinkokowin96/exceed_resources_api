import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Attachment } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class Department extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String })
  @IsString()
  shortName?: string;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => Attachment)
  attachments?: Attachment[];

  @Prop({ type: String })
  @IsString()
  remark?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  @IsNotEmpty()
  head: User;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Department' }] })
  departments?: Department[];
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
