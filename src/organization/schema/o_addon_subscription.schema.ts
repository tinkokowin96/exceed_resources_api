import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { EAddon } from 'src/common/util/enumn';
import { OUser } from 'src/o_user/schema/o_user.schema';

@Schema()
export class OAddonSubscription extends CoreSchema {
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numEmployee: number;

  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  allowEveryEmployee: boolean;

  @Prop({ type: String, enum: EAddon })
  @IsEnum(EAddon)
  type: EAddon;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'OUser' }] })
  @ValidateNested({ each: true })
  @Type(() => OUser)
  allowedOusers: OUser[];
}

export const OAddonSubscriptionSchema = SchemaFactory.createForClass(OAddonSubscription);
