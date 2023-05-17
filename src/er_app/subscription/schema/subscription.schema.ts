import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Organization } from 'src/organization/schema/organization.schema';

@Schema()
export class Subscription extends CoreSchema {
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numDay: number;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numEmployee: number;

  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  activeUntil: Date;

  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  active: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  organization: Organization;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
