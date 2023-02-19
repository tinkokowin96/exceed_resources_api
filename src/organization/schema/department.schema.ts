import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';

import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { AttachmentType } from 'src/common/util/schema.type';
import { OUser } from 'src/o_user/schema/o_user.schema';
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
  attachments: AttachmentType[];

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Permission' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Permission)
  permission: Permission;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'OUser' }] })
  @ValidateNested({ each: true })
  @Type(() => OUser)
  executives: OUser[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'OUser' }] })
  @ValidateNested({ each: true })
  @Type(() => OUser)
  colleagues: OUser[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Department' }] })
  @ValidateNested({ each: true })
  @Type(() => Department)
  departments: Department[];
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
