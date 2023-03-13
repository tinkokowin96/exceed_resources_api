import { Prop, Schema } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Field } from 'src/common/schema/field.schema';
import { EPosition } from 'src/common/util/enumn';
import { ExtraType } from 'src/common/util/schema.type';

@Schema()
export class OOvertime extends CoreSchema {
  @Prop({ type: Number })
  @IsNumber()
  baseAmountMultiplier: number;

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested()
  @Type(() => ExtraType)
  hourlyReward: ExtraType;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Field' }] })
  form: Field[];

  @Prop({ type: [{ type: String, enum: EPosition }] })
  @IsEnum(EPosition, { each: true })
  overtimeApprovablePositions: [EPosition];

  @Prop({ type: [{ type: String, enum: EPosition }] })
  @IsEnum(EPosition, { each: true })
  overtimeNotifyPositions: [EPosition];
}
