import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Promotion } from 'src/er_app/promotion/schema/promotion.schema';

/**
 * NOTE:
 * price is calcualted per day
 * 1st key is num employee, 2nd is day
 */
type SubscriptionPriceType = {
  [key: number]: {
    [key: number]: number;
  };
};

@Schema()
export class Subscription extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: [String], default: [] })
  @IsString({ each: true })
  allowedRoutes: string[];

  @Prop({ type: Boolean, required: true })
  @IsNotEmpty()
  @IsBoolean()
  isAddon: boolean;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  price: SubscriptionPriceType;

  @Prop({ type: String })
  @IsString()
  remark?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Promotion' })
  activePromotion?: Promotion;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
