import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { LocationType } from 'src/common/util/schema.type';

export class OUserStatus extends CoreSchema {
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
  @ValidateNested()
  location: LocationType;
}

export const OUserStatusSchema = SchemaFactory.createForClass(OUserStatus);
