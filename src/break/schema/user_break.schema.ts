import { Prop, Schema } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Counter, ExtraAllowance } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { ERequestStatus } from 'src/common/util/enumn';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class UserBreak extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  description: string;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  proposedMinutes: number;

  @Prop({ type: String, enum: ERequestStatus, required: true })
  @IsNotEmpty()
  @IsEnum(ERequestStatus)
  status: ERequestStatus;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Counter)
  breakTime: Counter;

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested()
  @Type(() => ExtraAllowance)
  penalty: ExtraAllowance;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  approvedBy: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  penalizedBy: User;
}
