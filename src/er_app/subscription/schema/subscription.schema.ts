import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Promotion } from 'src/er_app/promotion/schema/promotion.schema';
import { BatchSubscriptionPrice } from './batch_subscription_price.shema';

//NOTE: price is calculated per day
@Schema()
export class Subscription extends CoreSchema {
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested({ each: true })
  @Type(() => BatchSubscriptionPrice)
  batchPrice: BatchSubscriptionPrice[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Promotion' })
  activePromotion: Promotion;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
