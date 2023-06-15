import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Extra, ExtraAllowance } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Field } from 'src/common/schema/field.schema';
import { Leave } from 'src/leave/schema/leave.schema';
import { User } from 'src/user/schema/user.schema';
import { WorkingDay } from 'src/working_hour/schema/working_day.schema';

@Schema()
export class OConfig extends CoreSchema {
  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  showUserPhone?: boolean;

  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  requireCheckIn?: boolean;

  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  requireCheckOut?: boolean;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  flexibleWorkingHour?: boolean;

  @Prop({ type: [String], default: ['organization/change-super-admin'] })
  @IsString({ each: true })
  restrictedRoutes?: string[];

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  allowLateSubstitute?: boolean;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  allowUserBreak?: boolean;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @ArrayNotEmpty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => WorkingDay)
  workingDays: WorkingDay[];

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested({ each: true })
  @Type(() => ExtraAllowance)
  latePenalties?: ExtraAllowance[];

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested()
  @Type(() => Extra)
  overtimeHourlyAllowance?: Extra;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Field' }] })
  overtimeForm: Field[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  superAdmin?: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Leave' })
  leave?: Leave;
}

export const OConfigSchema = SchemaFactory.createForClass(OConfig);
