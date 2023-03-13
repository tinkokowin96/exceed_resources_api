import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Field } from 'src/common/schema/field.schema';
import { OUser } from 'src/o_user/schema/o_user.schema';

@Schema()
export class OUserOvertime extends CoreSchema {
  @Prop({ type: SchemaTypes.Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  overtimeHour: number;

  @Prop({ type: SchemaTypes.Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  reward: number;

  @Prop({ type: SchemaTypes.Boolean, default: false })
  @IsBoolean()
  isPoint: boolean;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => Field)
  form: Field[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OUser' })
  assignedBy: OUser;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OUser' })
  approvedBy: OUser;
}

export const OUserOvertimeSchema = SchemaFactory.createForClass(OUserOvertime);
