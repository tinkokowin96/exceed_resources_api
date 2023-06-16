import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { CoreSchema } from 'src/common/schema/core.shema';
import { WorkingDay } from './working_day.schema';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDateString, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Type } from 'class-transformer';
import { Extra, Location } from 'src/common/schema/common.schema';
import { Position } from 'src/position/position.schema';

export class CustomWorkDay extends IntersectionType(CoreSchema, OmitType(WorkingDay, ['day'])) {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  description: string;

  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  affectAllUser: boolean;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  allowRemoteCheckIn: boolean;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  isOptional: boolean;

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested()
  @Type(() => Extra)
  allowance?: Extra;

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested()
  @Type(() => Location)
  location?: Location;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  affectedUsers?: User[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  @IsNotEmpty()
  acceptedUsers?: User[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Position' }] })
  affectedPositions?: Position[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  @IsNotEmpty()
  createdBy: User;
}

export const CustomWorkDaySchema = SchemaFactory.createForClass(CustomWorkDay);
