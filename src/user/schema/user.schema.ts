import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Bank } from 'src/bank/schema/bank.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { ERequestStatus } from 'src/common/util/enumn';
import { OAssociated } from 'src/organization/schema/o_associated.schema';
import { Project } from 'src/project/schema/project.schema';
import { SalaryCategory } from 'src/salary/schema/salary_category.schema';
import { UserStatus } from './user_status.schema';
import { ChatGroup } from 'src/chat/schema/chat_group.shema';
import { DirectMessage } from 'src/chat/schema/direct_message.schema';

@Schema()
export class User extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String })
  @IsString()
  image: string;

  @Prop({ type: String, required: true, unique: true })
  @IsNotEmpty()
  @IsString()
  userName: string;

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
  deleted: boolean;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  loggedIn: boolean;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  blocked: boolean;

  @Prop({ type: String })
  @IsString()
  blockReason: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  joiningDate: Date;

  @Prop({ type: String, enum: ERequestStatus })
  @IsEnum(ERequestStatus)
  upgradeRequestStatus: ERequestStatus;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  accessErApp: boolean;

  @Prop({ type: Number })
  @IsNumber()
  basicSalary: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'UserStatus' })
  status: UserStatus;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Bank' })
  bank: Bank;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OAssociated' })
  currentOrganization: OAssociated;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'SalaryCategory' }] })
  earnings: SalaryCategory[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'SalaryCategory' }] })
  deductions: SalaryCategory[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Project' }] })
  projects: Project[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'OAssociated' }] })
  associatedOrganizations: OAssociated[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'ChatGroup' }] })
  chatGroups: ChatGroup[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'DirectMessage' }] })
  directMessages: DirectMessage[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  this.password = hashSync(this.password, 12);
  next();
});
