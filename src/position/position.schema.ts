import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { WorkingDay } from 'src/working_hour/schema/working_day.schema';

@Schema()
export class Position extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String, required: true })
  @IsString()
  shortName: string;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  flexibleWorkingHour?: boolean;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  basicSalary: number;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  isLateApprovable?: boolean;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  isOvertimeApprovable?: boolean;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  isLeaveApprovable?: boolean;

  @Prop({ type: String })
  @IsString()
  remark?: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @ValidateNested({ each: true })
  @Type(() => WorkingDay)
  workingDays?: WorkingDay[];

  @Prop({ type: [String], default: [] })
  @IsString({ each: true })
  allowedRoutes?: string[];
}

export const PositionSchema = SchemaFactory.createForClass(Position);
