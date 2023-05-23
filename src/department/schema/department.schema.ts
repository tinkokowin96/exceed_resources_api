import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';

import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Attachment } from 'src/common/schema/common.schema';
import { User } from 'src/user/schema/user.schema';
import { Permission } from 'src/permission/permission.schema';

@Schema()
export class Department extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  shortName: string;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => Attachment)
  attachments: Attachment[];

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Permission', required: true })
  @IsNotEmpty()
  permission: Permission;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  head: User;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  colleagues: User[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Department' }] })
  departments: Department[];
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
