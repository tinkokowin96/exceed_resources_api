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
import { Payment } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { ESubscriptionStatus } from 'src/common/util/enumn';
import { Subscription } from 'src/er_app/subscription/subscription.schema';
import { Organization } from 'src/organization/schema/organization.schema';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class OSubscription extends CoreSchema {
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numDay: number;

  @Prop({ type: Number, required: true })
  @IsNumber()
  numEmployee?: number;

  @Prop({ type: String, enum: ESubscriptionStatus, required: true })
  @IsNotEmpty()
  @IsEnum(ESubscriptionStatus)
  status: ESubscriptionStatus;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsDateString()
  activeUntil: string;

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

  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  allowEveryEmployee: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Subscription' })
  subscription?: Subscription;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Subscription' }] })
  addonSubscriptions?: Subscription[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  allowedUsers?: User[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  @IsNotEmpty()
  organization: Organization;
}

export const OSubscriptionSchema = SchemaFactory.createForClass(OSubscription);
