import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Extra, FieldValue } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class UserOvertime extends CoreSchema {
  @Prop({ type: SchemaTypes.Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  overtimeHour: number;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Extra)
  allowance: Extra;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => FieldValue)
  form: FieldValue[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  approvedBy: User;
}

export const UserOvertimeSchema = SchemaFactory.createForClass(UserOvertime);
