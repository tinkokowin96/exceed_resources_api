import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { CoreSchema } from 'src/core/schema/core.shema';

@Schema()
export class Currency extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String })
  @IsString()
  @MaxLength(5)
  shortName: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  symbol: string;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  baseAmount: number;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);
