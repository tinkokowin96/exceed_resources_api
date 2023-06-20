import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { Compensation } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { EExtraSalary, EExtraSalaryStatus } from 'src/common/util/enumn';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class ExtraSalary extends CoreSchema {
  @Prop({ type: String, enum: EExtraSalaryStatus, default: EExtraSalaryStatus.Pending })
  @IsEnum(EExtraSalaryStatus)
  status: EExtraSalaryStatus;

  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  earning: true;

  @Prop({ type: String, enum: EExtraSalary, required: true })
  @IsNotEmpty()
  @IsEnum(EExtraSalary)
  type: EExtraSalary;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Compensation)
  extra: Compensation;

  @Prop({ type: SchemaTypes.Mixed })
  payload: any;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  @IsNotEmpty()
  category: Category;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  @IsNotEmpty()
  user: User;
}

export const ExtraSalarySchema = SchemaFactory.createForClass(ExtraSalary);
