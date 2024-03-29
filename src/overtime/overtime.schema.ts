import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Compensation, FieldValue } from 'src/core/schema/common.schema';
import { CoreSchema } from 'src/core/schema/core.shema';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class Overtime extends CoreSchema {
  @Prop({ type: SchemaTypes.Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  overtimeHour: number;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Compensation)
  allowance: Compensation;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => FieldValue)
  form: FieldValue[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  adjudicatedBy: User;
}

export const OvertimeSchema = SchemaFactory.createForClass(Overtime);
