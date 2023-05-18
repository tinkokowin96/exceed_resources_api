import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Field } from 'src/common/schema/field.schema';
import { ExtraType, WorkingHourType } from 'src/common/util/schema.type';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class UserLate extends CoreSchema {
  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WorkingHourType)
  lateTime: WorkingHourType;

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested()
  @Type(() => ExtraType)
  penalty: ExtraType;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => Field)
  form: Field[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  approvedBy: User;
}

export const UserLateSchema = SchemaFactory.createForClass(UserLate);
