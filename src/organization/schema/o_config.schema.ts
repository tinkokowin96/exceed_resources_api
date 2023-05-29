import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { PayExtra, WorkingHour } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { EWeekDay } from 'src/common/util/enumn';
import { OLate } from 'src/late/schema/o_late.schema';
import { OLeave } from 'src/leave/schema/o_leave.schema';
import { OOvertime } from 'src/overtime/schema/o_overtime';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class OConfig extends CoreSchema {
  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  showOwnerPhone?: boolean;

  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  showOwnerEmail?: boolean;

  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  showCUserPhone?: boolean;

  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  requireCheckIn?: boolean;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  allowedLateAsOntime?: boolean;

  @Prop({ type: [String], default: ['organization/change-super-admin'] })
  @IsString({ each: true })
  restrictedRoutes?: string[];

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WorkingHour)
  checkInTime: WorkingHour;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WorkingHour)
  checkOutTime: WorkingHour;

  @Prop({ type: [SchemaTypes.Mixed], default: [] })
  @ValidateNested({ each: true })
  @Type(() => PayExtra)
  ontimeReward?: PayExtra[];

  @Prop({ type: [{ type: String, enum: EWeekDay }], default: [] })
  @IsEnum(EWeekDay, { each: true })
  workDays?: EWeekDay[];

  @Prop({ type: [{ type: String, enum: EWeekDay }], default: [] })
  @IsEnum(EWeekDay, { each: true })
  inOfficeWorkDays?: EWeekDay[];

  @Prop({ type: [{ type: String, enum: EWeekDay }], default: [] })
  @IsEnum(EWeekDay, { each: true })
  remoteWorkDays?: EWeekDay[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  superAdmin?: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OLate' })
  late?: OLate;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OOvertime' })
  overtime?: OOvertime;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OLeave' })
  leave?: OLeave;
}

export const OConfigSchema = SchemaFactory.createForClass(OConfig);
