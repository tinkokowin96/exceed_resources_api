import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Field } from 'src/common/schema/field.schema';
import { Leave } from 'src/leave/schema/leave.schema';
import { WorkDay } from 'src/working_hour/schema/work_day_config.schema';

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
  @ArrayNotEmpty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => WorkDay)
  workDays: WorkDay[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Field' }] })
  overtimeForm: Field[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Leave' })
  leave?: Leave;
}

export const OConfigSchema = SchemaFactory.createForClass(OConfig);
