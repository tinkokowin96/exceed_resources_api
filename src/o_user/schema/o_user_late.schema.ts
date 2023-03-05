import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { EWorkingHour } from 'src/common/util/enumn';
import { WorkingHourType } from 'src/common/util/schema.type';
import { Break } from 'src/organization/schema/break.schema';

export class OUserLate extends CoreSchema {
  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WorkingHourType)
  lateTime: WorkingHourType;

  @Prop({ type: String, enum: EWorkingHour, default: EWorkingHour.CheckIn })
  @IsEnum(EWorkingHour)
  type: EWorkingHour;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Break' })
  break: Break;
}

export const OUserLateSchema = SchemaFactory.createForClass(OUserLate);
