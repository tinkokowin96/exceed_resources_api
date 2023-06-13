import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Currency } from '../schema/currency.schema';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCurrencyDto extends Currency {}

export class EditCurrencyDto extends PartialType(OmitType(Currency, ['_id', 'updatedAt'])) {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  id: string;
}
