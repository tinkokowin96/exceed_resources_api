import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsEnum } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { EAddon } from 'src/common/util/enumn';
import { OUser } from 'src/o_user/schema/o_user.schema';
import { Subscription } from './subscription.schema';

@Schema()
export class AddonSubscription extends Subscription {
  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  allowEveryEmployee: boolean;

  @Prop({ type: String, enum: EAddon })
  @IsEnum(EAddon)
  addon: EAddon;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'OUser' }] })
  allowedOUsers: OUser[];
}

export const AddonSubscriptionSchema = SchemaFactory.createForClass(AddonSubscription);
