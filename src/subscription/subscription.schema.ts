import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Promotion } from 'src/promotion/promotion.schema';

class DayPrice {
  @IsNotEmpty()
  @IsNumber()
  numDay: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class SubscriptionPrice {
  @IsNotEmpty()
  @IsNumber()
  numEmployee: number;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DayPrice)
  dayPrice: DayPrice[];
}

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
  isPointUsable: boolean;

  @Prop({ type: Boolean, required: true })
  @IsNotEmpty()
  @IsBoolean()
  isAddon: boolean;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SubscriptionPrice)
  price: SubscriptionPrice[];

  @Prop({ type: String })
  @IsString()
  remark?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Promotion' })
  activePromotion?: Promotion;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
