import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { User } from 'src/user/schema/user.schema';
import { Leave } from './leave.schema';
import { ERequestStatus } from 'src/common/util/enumn';

@Schema()
export class AccumulatedLeave extends CoreSchema {
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  numDay: number;

  @Prop({ type: Boolean, required: true })
  @IsNotEmpty()
  @IsBoolean()
  canCarryNextYear: boolean;

  @Prop({ type: String, enum: ERequestStatus, required: true })
  @IsNotEmpty()
  @IsEnum(ERequestStatus)
  status: ERequestStatus;

  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  isEntitledLeave?: boolean;

  @Prop({ type: String })
  @IsString()
  remark?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Leave' })
  @IsNotEmpty()
  leave: Leave;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  grantedBy?: User;
}

export const AccumulatedLeaveSchema = SchemaFactory.createForClass(AccumulatedLeave);
