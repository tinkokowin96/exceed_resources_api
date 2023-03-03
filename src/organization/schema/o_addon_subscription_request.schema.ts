import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Cupon } from './cupon.schema';
import { OAddonSubscription } from './o_addon_subscription.schema';

@Schema()
export class OAddonSubscriptionRequest extends CoreSchema {
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numEmployee: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Cupon' })
  @ValidateNested()
  @Type(() => Cupon)
  cupon: Cupon;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OAddonSubscription' })
  @ValidateNested()
  @Type(() => OAddonSubscription)
  addon: OAddonSubscription;
}

export const OAddonSubscriptionRequestSchema = SchemaFactory.createForClass(OAddonSubscriptionRequest);
