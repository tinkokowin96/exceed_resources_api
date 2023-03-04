import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { EAddon } from 'src/common/util/enumn';
import { Cupon } from 'src/er_app/schema/cupon.schema';

@Schema()
export class Promotion extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: Boolean, default: false })
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

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Cupon' })
  @ValidateNested()
  @Type(() => Cupon)
  cupon: Cupon;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
