import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CoreSchema } from 'src/common/schema/core.shema';

@Schema()
export class CuponCode extends CoreSchema {
  @Prop({ type: String, required: true, unique: true })
  @IsNotEmpty()
  @IsString()
  code: string;

  @Prop({ type: Boolean, required: true })
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  @Prop({ type: Boolean, required: true })
  @IsNotEmpty()
  @IsBoolean()
  isUsed: boolean;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numCupon: number;

  @Prop({ type: Number })
  @IsNumber()
  numUsable: number;
}

export const CuponCodeSchema = SchemaFactory.createForClass(CuponCode);
