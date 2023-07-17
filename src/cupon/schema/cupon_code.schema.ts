import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/core/schema/core.shema';
import { Cupon } from './cupon.schema';

@Schema()
export class CuponCode extends CoreSchema {
  @Prop({ type: String, required: true, unique: true })
  @IsNotEmpty()
  @IsString()
  code: string;

  @Prop({ type: Boolean, default: 0 })
  @IsNumber()
  numUsed: number;

  @Prop({ type: Number, default: 1 })
  @IsNumber()
  numUsable: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Cupon' })
  @IsNotEmpty()
  cupon?: Cupon;
}

export const CuponCodeSchema = SchemaFactory.createForClass(CuponCode);
