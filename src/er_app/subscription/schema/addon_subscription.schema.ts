import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Subscription } from './subscription.schema';

@Schema()
export class AddonSubscription extends Subscription {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: [String], required: true })
  @IsNotEmpty()
  @IsString({ each: true })
  allowedRoutes: string[];
}

export const AddonSubscriptionSchema = SchemaFactory.createForClass(AddonSubscription);
