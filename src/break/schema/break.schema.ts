import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Organization } from 'src/organization/schema/organization.schema';

export class Break extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  endName: string;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  allowedHour: number;

  @Prop({ type: Boolean, default: false })
  @IsNumber()
  takeAnyTime: number;

  @Prop({ type: Number })
  @IsNumber()
  startTime: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization', required: true })
  @IsNotEmpty()
  orgainzation: Organization;
}

export const BreakSchema = SchemaFactory.createForClass(Break);
