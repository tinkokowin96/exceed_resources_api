import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { ESubscriptionStatus } from 'src/common/util/enumn';
import { PaymentType } from 'src/common/util/schema.type';
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

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Cupon' })
  cupon: Cupon;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  organization: Organization;
}

export const SubscriptionRequestSchema = SchemaFactory.createForClass(SubscriptionRequest);
