import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { Compensation } from 'src/core/schema/common.schema';
import { CoreSchema } from 'src/core/schema/core.shema';
import { EExtraSalaryStatus } from 'src/core/util/enumn';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class ExtraSalary extends CoreSchema {
  @Prop({ type: String, enum: EExtraSalaryStatus, default: EExtraSalaryStatus.Pending })
  @IsEnum(EExtraSalaryStatus)
  status?: EExtraSalaryStatus;

  @Prop({ type: Boolean, required: true })
  @IsNotEmpty()
  @IsBoolean()
  earning: boolean;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Compensation)
  extra: Compensation;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  @IsNotEmpty()
  category?: Category;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  @IsNotEmpty()
  user: User;
}

export const ExtraSalarySchema = SchemaFactory.createForClass(ExtraSalary);
