import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Field } from 'src/common/schema/field.schema';
import { OUser } from 'src/o_user/schema/o_user.schema';
import { SalaryCategory } from 'src/salary/schema/salary_category.schema';

@Schema()
export class OUserLeave extends CoreSchema {
  @Prop({ type: SchemaTypes.Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numDay: number;

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested()
  @Type(() => SalaryCategory)
  penalty: SalaryCategory;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => Field)
  form: Field[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OUser' })
  assignedBy: OUser;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OUser' })
  approvedBy: OUser;
}

export const OUserLeaveSchema = SchemaFactory.createForClass(OUserLeave);
