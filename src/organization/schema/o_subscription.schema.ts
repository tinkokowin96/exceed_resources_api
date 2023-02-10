import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { ESubscriptionStatus } from 'src/common/util/enumn';
import { PaymentType } from 'src/common/util/schema.type';
import { SubscriptionAddon } from './subscription_addon.schema';

@Schema()
export class OSubscription extends CoreSchema {
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numMonth: number;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numEmployee: number;

  @Prop({ type: String, required: true, enum: ESubscriptionStatus })
  @IsNotEmpty()
  @IsEnum(ESubscriptionStatus)
  status: ESubscriptionStatus;

  @Prop({ type: String })
  @IsString()
  declineRemark: string;

  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  activeUntil: Date;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  payment: PaymentType;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'SubscriptionAddon' }] })
  @ValidateNested({ each: true })
  addons: SubscriptionAddon;
}

export const OSubscriptionSchema = SchemaFactory.createForClass(OSubscription);
