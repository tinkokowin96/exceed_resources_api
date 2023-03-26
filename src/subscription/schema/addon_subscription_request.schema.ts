import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum } from 'class-validator';
import { EAddon } from 'src/common/util/enumn';
import { SubscriptionRequest } from './subscription_request.schema';

@Schema()
export class AddonSubscriptionRequest extends SubscriptionRequest {
  @Prop({ type: String, enum: EAddon })
  @IsEnum(EAddon)
  addon: EAddon;
}

export const AddonSubscriptionRequestSchema = SchemaFactory.createForClass(AddonSubscriptionRequest);
