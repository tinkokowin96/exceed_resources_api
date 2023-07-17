import { Prop } from '@nestjs/mongoose';
import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/core/schema/core.shema';
import { EScheduledTask } from 'src/core/util/enumn';
import { User } from 'src/user/schema/user.schema';

export class ScheduledTask extends CoreSchema {
  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  executionTime: Date;

  @Prop({ type: String, enum: EScheduledTask })
  @IsNotEmpty()
  @IsEnum(EScheduledTask)
  type: EScheduledTask;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  payload: any;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  @IsNotEmpty()
  user: User;
}
