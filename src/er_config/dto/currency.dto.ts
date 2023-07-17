import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { AppOmit } from 'src/core/dto/core.dto';
import { Currency } from '../schema/currency.schema';

export class CreateCurrencyDto extends Currency {}

export class EditCurrencyDto extends PartialType(AppOmit(Currency)) {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  id: string;
}
