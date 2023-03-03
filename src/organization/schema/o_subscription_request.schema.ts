import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { ESubscriptionStatus } from 'src/common/util/enumn';
import { PaymentType } from 'src/common/util/schema.type';
import { Organization } from './organization.schema';
import { OAddonSubscriptionRequest } from './o_addon_subscription_request.schema';

@Schema()
export class OSubscription extends CoreSchema {
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numDay: number;

  //NOTE: this is nullable on addon subscription
  @Prop({ type: Number })
  @IsNumber()
  numEmployee: number;

  @Prop({ type: String, required: true, enum: ESubscriptionStatus })
  @IsNotEmpty()
  @IsEnum(ESubscriptionStatus)
  status: ESubscriptionStatus;

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaymentType)
  payment: PaymentType;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'OAddonSubscriptionRequest' }] })
  @ValidateNested()
  @Type(() => OAddonSubscriptionRequest)
  addons: OAddonSubscriptionRequest[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  @ValidateNested()
  @Type(() => Organization)
  organization: Organization;
}

export const OSubscriptionSchema = SchemaFactory.createForClass(OSubscription);
