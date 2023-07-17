import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/core/schema/core.shema';
import { Location } from 'src/core/schema/common.schema';

export class UserStatus extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  until: Date;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  color: string;

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: SchemaTypes.Mixed })
  location: Location;
}

export const UserStatusSchema = SchemaFactory.createForClass(UserStatus);
