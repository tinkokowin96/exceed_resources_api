import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { EWeekDay } from 'src/common/util/enumn';
import { PayExtraType } from 'src/common/util/schema.type';
import { Organization } from './organization.schema';

@Schema()
export class OConfig extends CoreSchema {
  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  loginAllAssociated: boolean;

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

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  ownerCreateOwnerAccount: boolean;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  ownerCreateCUserAccount: boolean;

  @Prop({ type: Number })
  @IsNumber()
  checkInTime: number;

  @Prop({ type: Number })
  @IsNumber()
  checkOutTime: number;

  @Prop({ type: [String], required: true })
  @IsNotEmpty()
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
