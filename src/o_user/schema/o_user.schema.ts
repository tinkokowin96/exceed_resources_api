import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsPhoneNumber } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Bank } from 'src/bank/schema/bank.schema';
import { UserSchema } from 'src/common/schema/user.shema';
import { ERequestStatus } from 'src/common/util/enumn';
import { OAssociated } from 'src/organization/schema/o_associated.schema';
import { Project } from 'src/project/schema/project.schema';
import { SalaryCategory } from 'src/salary/schema/salary_category.schema';
import { OUserStatus } from './o_user_status.schema';

@Schema()
export class OUser extends UserSchema {
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
  accessAdminApp: boolean;

  @Prop({ type: Number })
  @IsNumber()
  basicSalary: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OUserStatus' })
  status: OUserStatus;

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
}

export const OUserSchema = SchemaFactory.createForClass(OUser);

OUserSchema.pre('save', function (next) {
  this.password = hashSync(this.password, 12);
  next();
});
