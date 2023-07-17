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
import { Payment } from 'src/core/schema/common.schema';
import { CoreSchema } from 'src/core/schema/core.shema';
import { ESubscriptionStatus } from 'src/core/util/enumn';
import { Subscription } from 'src/subscription/subscription.schema';
import { Organization } from 'src/organization/schema/organization.schema';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class OSubscription extends CoreSchema {
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numDay: number;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numSlot: number;

  @Prop({ type: Number, default: 0 })
  @IsNumber()
  usedSlot?: number;

  @Prop({ type: String, enum: ESubscriptionStatus, required: true })
  @IsNotEmpty()
  @IsEnum(ESubscriptionStatus)
  status: ESubscriptionStatus;

  //NOTE: this wil null until subscription is approved...
  @Prop({ type: Date })
  @IsDateString()
  activeUntil?: Date;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  active?: boolean;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  isAddon?: boolean;

  @Prop({ type: String })
  @IsString()
  remark?: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Payment)
  payment: Payment;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Subscription' })
  @IsNotEmpty()
  subscription: Subscription;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  @IsNotEmpty()
  organization: Organization;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  users: User[];
}

export const OSubscriptionSchema = SchemaFactory.createForClass(OSubscription);
