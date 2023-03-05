import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { PaymentType } from 'src/common/util/schema.type';
import { Organization } from './organization.schema';
import { OAddonSubscription } from './o_addon_subscription.schema';

@Schema()
export class OSubscription extends CoreSchema {
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numDay: number;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numEmployee: number;

  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  activeUntil: Date;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaymentType)
  payment: PaymentType;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'OAddonSubscription' }] })
  addons: OAddonSubscription[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  organization: Organization;
}

export const OSubscriptionSchema = SchemaFactory.createForClass(OSubscription);
