import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { EAddon, ESubscriptionStatus } from 'src/common/util/enumn';
import { Payment } from 'src/common/schema/common.schema';
import { Organization } from '../../../organization/schema/organization.schema';
import { Cupon } from 'src/er_app/cupon/schema/cupon.schema';

@Schema()
export class SubscriptionRequest extends CoreSchema {
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numDay: number;

  @Prop({ type: Number })
  @IsNumber()
  numEmployee?: number;

  @Prop({ type: String, enum: ESubscriptionStatus, required: true })
  @IsNotEmpty()
  @IsEnum(ESubscriptionStatus)
  status: ESubscriptionStatus;

  @Prop({ type: String, enum: EAddon, required: true })
  @IsNotEmpty()
  @IsEnum(EAddon)
  addon: EAddon;

  @Prop({ type: String })
  @IsString()
  remark?: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Payment)
  payment: Payment;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Cupon' })
  cupon?: Cupon;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  @IsNotEmpty()
  organization: Organization;
}

export const SubscriptionRequestSchema = SchemaFactory.createForClass(SubscriptionRequest);
