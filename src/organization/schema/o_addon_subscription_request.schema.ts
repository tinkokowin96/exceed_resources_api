import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Cupon } from '../../er_app/schema/cupon.schema';
import { OAddonSubscription } from './o_addon_subscription.schema';

@Schema()
export class OAddonSubscriptionRequest extends CoreSchema {
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numEmployee: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Cupon' })
  cupon: Cupon;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OAddonSubscription' })
  addon: OAddonSubscription;
}

export const OAddonSubscriptionRequestSchema = SchemaFactory.createForClass(OAddonSubscriptionRequest);
