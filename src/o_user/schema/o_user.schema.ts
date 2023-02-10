import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';
import { IsDateString, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { OUserBank } from 'src/bank/schema/o_user_bank.schema';
import { UserSchema } from 'src/common/schema/user.shema';
import { OAssociated } from 'src/organization/schema/o_associated.schema';
import { Project } from 'src/project/schema/project.schema';
import { SalaryCategory } from 'src/salary/schema/salary_category.schema';
import { OUserStatus } from './o_user_status.schema';

@Schema()
export class OUser extends UserSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  joiningDate: Date;

  //NOTE: the following are optional for o_admin_user
  @Prop({ type: Number })
  @IsNumber()
  basicSalary: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OUserStatus' })
  @ValidateNested()
  status: OUserStatus;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OUserBank' })
  @ValidateNested()
  bank: OUserBank;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OAssociated' })
  @ValidateNested({ each: true })
  currentOrganization: OAssociated;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'SalaryCategory' }] })
  @ValidateNested({ each: true })
  earnings: SalaryCategory[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'SalaryCategory' }] })
  @ValidateNested({ each: true })
  deductions: SalaryCategory[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Project' }] })
  @ValidateNested({ each: true })
  projects: Project[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'OAssociated' }] })
  @ValidateNested({ each: true })
  associatedOrganizations: OAssociated[];
}

export const OUserSchema = SchemaFactory.createForClass(OUser);

OUserSchema.pre('save', function (next) {
  this.password = hashSync(this.password, 12);
  next();
});
