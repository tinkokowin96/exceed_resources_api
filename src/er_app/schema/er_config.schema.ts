import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Currency } from './currency.schema';

@Schema()
export class ErConfig extends CoreSchema {
  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  convertBase: boolean;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  convertTolerance: number;

  @Prop({ type: [String], required: true })
  @IsNotEmpty()
  @IsString({ each: true })
  restrictedRoutes: string[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Currency' })
  @IsNotEmpty()
  @ValidateNested()
  baseCurrency: Currency;
}

export const ErConfigSchema = SchemaFactory.createForClass(ErConfig);
