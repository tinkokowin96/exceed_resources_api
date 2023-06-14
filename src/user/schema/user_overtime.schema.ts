import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { EWorkingHour } from 'src/common/util/enumn';
import { Break } from 'src/break/schema/break.schema';

export class UserWorkingHour extends CoreSchema {
  @Prop({ type: String })
  @IsString()
  name: string;

  @Prop({ type: String, enum: EWorkingHour, default: EWorkingHour.CheckIn })
  @IsEnum(EWorkingHour)
  type: EWorkingHour;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Break' })
  break: Break;
}

export const UserWorkingHourSchema = SchemaFactory.createForClass(UserWorkingHour);
