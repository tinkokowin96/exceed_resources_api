import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ArrayNotEmpty, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CoreSchema } from 'src/common/schema/core.shema';
import { EAddon } from 'src/common/util/enumn';

@Schema()
export class SubscriptionAddon extends CoreSchema {
  @Prop({ type: String, enum: EAddon })
  @IsNotEmpty()
  @IsEnum(EAddon)
  type: EAddon;

  @Prop({ type: [String], required: true })
  @ArrayNotEmpty()
  @IsString({ each: true })
  allowedRoutes: string[];
}

export const SubscriptionAddonSchema = SchemaFactory.createForClass(SubscriptionAddon);
