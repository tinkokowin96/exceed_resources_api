import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { EExtra, ETrigger } from 'src/common/util/enumn';

@Schema()
export class SalaryCategory {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  effectiveDate: Date;

  @Prop({ type: Boolean, required: true })
  @IsNotEmpty()
  @IsBoolean()
  earning: boolean;

  @Prop({ type: String, enum: ETrigger, required: true })
  @IsNotEmpty()
  @IsEnum(ETrigger)
  activeOnEvery: ETrigger;

  @Prop({ type: String, enum: EExtra, required: true })
  @IsNotEmpty()
  @IsEnum(EExtra)
  extra: EExtra;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @Prop({ type: String })
  @IsString()
  remark: string;

  // @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Field' }] })
  // fields: Field[];
}

export const SalaryCategorySchema = SchemaFactory.createForClass(SalaryCategory);
