import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';
import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Bank } from 'src/bank/bank.schema';
import { ChatGroup } from 'src/chat/schema/chat_group.shema';
import { DirectMessage } from 'src/chat/schema/direct_message.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { OAssociated } from 'src/organization/schema/o_associated.schema';
import { Project } from 'src/project/schema/project.schema';
import { UserStatus } from './user_status.schema';

@Schema()
export class User extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String, required: true, unique: true })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @Prop({ type: String })
  @IsString()
  image?: string;

  @Prop({ type: String, required: true, unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  password: string;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  deleted?: boolean;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  loggedIn?: boolean;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  blocked?: boolean;

  @Prop({ type: String })
  @IsString()
  blockReason?: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  joiningDate: Date;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  accessErApp: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'UserStatus' })
  status?: UserStatus;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Bank' })
  bank?: Bank;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OAssociated' })
  @IsNotEmpty()
  currentOrganization: OAssociated;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Project' }] })
  projects?: Project[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'OAssociated' }] })
  @IsNotEmpty()
  associatedOrganizations: OAssociated[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'ChatGroup' }] })
  chatGroups?: ChatGroup[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'DirectMessage' }] })
  directMessages?: DirectMessage[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  this.password = hashSync(this.password, 12);
  next();
});
