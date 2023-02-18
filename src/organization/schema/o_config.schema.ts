import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { EWeekDay } from 'src/common/util/enumn';
import { PayExtraType, WorkingHourType } from 'src/common/util/schema.type';
import { Organization } from './organization.schema';

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

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  checkInTime: WorkingHourType;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  checkOutTime: WorkingHourType;

  @Prop({ type: [String], default: ['organization/change-super-admin'] })
  @IsString({ each: true })
  restrictedRoutes: string[];

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  latePenalty: PayExtraType[];

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
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

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  @ValidateNested()
  organization: Organization;
}

export const OConfigSchema = SchemaFactory.createForClass(OConfig);
