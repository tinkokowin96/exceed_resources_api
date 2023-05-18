import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { EWeekDay } from 'src/common/util/enumn';
import { PayExtraType, WorkingHourType } from 'src/common/util/schema.type';
import { OLate } from 'src/late/schema/o_late.schema';
import { OLeave } from 'src/leave/schema/o_leave.schema';
import { OOvertime } from 'src/overtime/schema/o_overtime';
import { Organization } from './organization.schema';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class OConfig extends CoreSchema {
  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  showOwnerPhone: boolean;

  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  showOwnerEmail: boolean;

  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  showCUserPhone: boolean;

  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  requireCheckIn: boolean;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  allowedLateAsOntime: boolean;

  @Prop({ type: [String], default: ['organization/change-super-admin'] })
  @IsString({ each: true })
  restrictedRoutes: string[];

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WorkingHourType)
  checkInTime: WorkingHourType;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WorkingHourType)
  checkOutTime: WorkingHourType;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => PayExtraType)
  ontimeReward: PayExtraType[];

  @Prop({ type: [{ type: String, enum: EWeekDay }] })
  @IsEnum(EWeekDay, { each: true })
  workingDays: EWeekDay[];

  @Prop({ type: [{ type: String, enum: EWeekDay }] })
  @IsEnum(EWeekDay, { each: true })
  inOfficeWorkingDays: EWeekDay[];

  @Prop({ type: [{ type: String, enum: EWeekDay }] })
  @IsEnum(EWeekDay, { each: true })
  remoteWorkingDays: EWeekDay[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  superAdmin: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OLate' })
  late: OLate;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OOvertime' })
  overtime: OOvertime;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OLeave' })
  leave: OLeave;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  organization: Organization;
}

export const OConfigSchema = SchemaFactory.createForClass(OConfig);
