import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { EAddon } from 'src/common/util/enumn';
import { ExtraType } from 'src/common/util/schema.type';

@Schema()
export class Promotion extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  active: boolean;

  @Prop({ type: Date })
  @IsDateString()
  active_until: Date;

  @Prop({ type: String, enum: EAddon })
  @IsEnum(EAddon)
  addon: EAddon;

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ExtraType)
  allowance: ExtraType;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
