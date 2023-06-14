import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Extra, FieldValue } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class UserLeave extends CoreSchema {
  @Prop({ type: SchemaTypes.Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numDay: number;

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested()
  @Type(() => Extra)
  penalty: Extra;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => FieldValue)
  form: FieldValue[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  approvedBy: User;
}

export const UserLeaveSchema = SchemaFactory.createForClass(UserLeave);
