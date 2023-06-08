import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { Attachment } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Department } from '../../department/department.schema';
import { OConfig } from './o_config.schema';

@Schema()
export class Organization extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String })
  @IsString()
  logo?: string;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  approved?: false;

  @Prop({ type: Number, default: 0 })
  @IsNumber()
  numPoint?: number;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => Attachment)
  attachments?: Attachment[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  type?: Category;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OConfig' })
  @IsNotEmpty()
  config: OConfig;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Department' }] })
  departments?: Department[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
