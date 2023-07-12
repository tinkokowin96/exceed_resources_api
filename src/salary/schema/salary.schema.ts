import { Prop, Schema } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { StatementPeriod } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { ExtraSalary } from 'src/extra_salary/extra_salary.schema';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class Salary extends CoreSchema {
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  basicSalary: number;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  totalSalary: number;

  @Prop({ type: String })
  @IsString()
  remark?: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => StatementPeriod)
  earningMonth: StatementPeriod;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'ExtraSalary' }] })
  extras: ExtraSalary[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  paymentMethod: Category;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  paidBy: User;
}
