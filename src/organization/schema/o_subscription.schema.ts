import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { EAddon, ESubscriptionStatus } from 'src/common/util/enumn';
import { PaymentType } from 'src/common/util/schema.type';
import { Organization } from './organization.schema';

@Schema()
export class OSubscription extends CoreSchema {
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numMonth: number;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numEmployee: number;

  @Prop({ type: String, required: true, enum: ESubscriptionStatus })
  @IsNotEmpty()
  @IsEnum(ESubscriptionStatus)
  status: ESubscriptionStatus;

  @Prop({ type: String })
  @IsString()
  declineRemark: string;

  @Prop({ type: Boolean, required: true })
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  activeUntil: Date;

  @Prop({ type: [{ type: String, enum: EAddon }] })
  @IsEnum(EAddon, { each: true })
  addons: EAddon[];

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaymentType)
  payment: PaymentType;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  @ValidateNested()
  @Type(() => Organization)
  organization: Organization;
}

export const OSubscriptionSchema = SchemaFactory.createForClass(OSubscription);
