import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsEnum } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { EAddon } from 'src/common/util/enumn';
import { User } from 'src/user/schema/user.schema';
import { Subscription } from './subscription.schema';

@Schema()
export class AddonSubscription extends Subscription {
  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  allowEveryEmployee: boolean;

  @Prop({ type: String, enum: EAddon })
  @IsEnum(EAddon)
  addon: EAddon;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  allowedUsers: User[];
}

export const AddonSubscriptionSchema = SchemaFactory.createForClass(AddonSubscription);
