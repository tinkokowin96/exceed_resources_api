import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Field } from 'src/common/schema/field.schema';
import { LeaveAllowed } from 'src/leave/schema/leave.schema';
import { WorkDay } from 'src/work_day/schema/work_day_config.schema';

@Schema()
export class OConfig extends CoreSchema {
  @Prop({ type: Number, default: 10 })
  @IsNumber()
  toleranceRangeInMeter?: number;

  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  showUserPhone?: boolean;

  @Prop({ type: [String], default: ['organization/change-super-admin'] })
  @IsString({ each: true })
  restrictedRoutes?: string[];

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => WorkDay)
  workDays: WorkDay[];

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested({ each: true })
  @Type(() => LeaveAllowed)
  leaves?: LeaveAllowed[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Field' }] })
  overtimeForm: Field[];
}

export const OConfigSchema = SchemaFactory.createForClass(OConfig);
