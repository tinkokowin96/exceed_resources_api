import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Compensation, Location } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Position } from 'src/position/position.schema';
import { User } from 'src/user/schema/user.schema';
import { WorkDayConfig } from './work_day_config.schema';
import { Break } from 'src/break/schema/break.schema';

export class CustomWorkDay extends CoreSchema {
  @Prop({ type: String })
  @IsString()
  name?: string;

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
  isOptional: boolean;

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested()
  @Type(() => Compensation)
  allowance?: Compensation;

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested()
  @Type(() => Location)
  location?: Location;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WorkDayConfig)
  config: WorkDayConfig;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  affectedUsers?: User[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  @IsNotEmpty()
  acceptedUsers?: User[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Position' }] })
  affectedPositions?: Position[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Break' }] })
  breaks?: Break[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  @IsNotEmpty()
  createdBy: User;
}

export const CustomWorkDaySchema = SchemaFactory.createForClass(CustomWorkDay);
