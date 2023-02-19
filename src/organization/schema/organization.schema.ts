import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { AttachmentType } from 'src/common/util/schema.type';
import { OUser } from 'src/o_user/schema/o_user.schema';
import { Department } from './department.schema';
import { OConfig } from './o_config.schema';

@Schema()
export class Organization extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String })
  @IsString()
  logo: string;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => AttachmentType)
  attachments: AttachmentType[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OUser' })
  @ValidateNested()
  @Type(() => OUser)
  superAdmin: OUser;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  @ValidateNested()
  @Type(() => Category)
  type: Category;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OConfig' })
  @ValidateNested()
  @Type(() => OConfig)
  config: OConfig;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Department' }] })
  @ValidateNested({ each: true })
  @Type(() => Department)
  departments: Department[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'OUser' }] })
  @ValidateNested({ each: true })
  @Type(() => OUser)
  colleagues: OUser[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
