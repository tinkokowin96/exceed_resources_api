import { Prop } from '@nestjs/mongoose';
import { IsDateString, IsNotEmpty } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';

export class ScheduledTask extends CoreSchema {
  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  executionTime: Date;

  @Prop({ type: String })
  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  payload: any;
}
