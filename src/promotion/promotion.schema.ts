import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { PromotionAllowance } from 'src/core/schema/common.schema';
import { CoreSchema } from 'src/core/schema/core.shema';

@Schema()
export class Promotion extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  active?: boolean;

  @Prop({ type: Date })
  @IsDateString()
  active_until?: Date;

  @Prop({ type: String })
  @IsString()
  remark?: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PromotionAllowance)
  allowance: PromotionAllowance;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
