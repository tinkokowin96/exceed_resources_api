import { Prop, Schema } from '@nestjs/mongoose';
import { IsDateString, IsMongoId } from 'class-validator';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export class CoreSchema {
  @Prop({ type: SchemaTypes.ObjectId })
  @IsMongoId()
  _id: Types.ObjectId;

  @Prop({ type: Date })
  @IsDateString()
  updatedAt: Date;
}
