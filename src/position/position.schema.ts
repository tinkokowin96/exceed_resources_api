import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CoreSchema } from 'src/common/schema/core.shema';
import { OConfig } from 'src/organization/schema/o_config.schema';

@Schema()
export class Position extends IntersectionType(CoreSchema, OmitType(OConfig, ['showUserPhone'])) {
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

  @Prop({ type: [String], default: [] })
  @IsString({ each: true })
  allowedRoutes?: string[];
}

export const PositionSchema = SchemaFactory.createForClass(Position);
