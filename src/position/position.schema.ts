import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Break } from 'src/break/schema/break.schema';
import { CoreSchema } from 'src/core/schema/core.shema';
import { OConfig } from 'src/organization/schema/o_config.schema';

@Schema()
export class Position extends CoreSchema {
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

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OConfig' })
  config: OConfig;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Break' }] })
  breaks?: Break[];
}

export const PositionSchema = SchemaFactory.createForClass(Position);
