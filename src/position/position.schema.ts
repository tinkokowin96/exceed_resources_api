import { OmitType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OConfig } from 'src/organization/schema/o_config.schema';

@Schema()
export class Position extends OmitType(OConfig, ['superAdmin']) {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String, required: true })
  @IsString()
  shortName: string;

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
