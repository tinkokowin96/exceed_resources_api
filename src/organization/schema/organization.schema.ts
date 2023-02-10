import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { AttachmentType } from 'src/common/util/schema.type';
import { OAdminUser } from 'src/o_admin_app/schema/o_admin_user.schema';
import { OUser } from 'src/o_user/schema/o_user.schema';
import { Department } from './department.schema';
import { OConfig } from './o_config.schema';
import { OSubscription } from './o_subscription.schema';

@Schema()
export class Organization extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  logo: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OAdminUser' })
  @ValidateNested()
  superAdmin: OAdminUser;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  @ValidateNested()
  type: Category;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OConfig' })
  @ValidateNested()
  config: OConfig;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OSubscription' })
  @ValidateNested()
  activeSubscription: OSubscription;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'OSubscription' }] })
  @ValidateNested({ each: true })
  subscriptionHistory: OSubscription[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Department' }] })
  @ValidateNested({ each: true })
  departments: Department[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'OUser' }] })
  @ValidateNested({ each: true })
  colleagues: OUser[];

  @Prop({ type: [{ type: SchemaTypes.Mixed }] })
  @ValidateNested({ each: true })
  attachments: AttachmentType[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
