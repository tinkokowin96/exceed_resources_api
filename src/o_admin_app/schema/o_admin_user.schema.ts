import { OmitType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';
import { IsBoolean, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { OUserBank } from 'src/bank/schema/o_user_bank.schema';
import { OUser } from 'src/o_user/schema/o_user.schema';

@Schema()
export class OAdminUser extends OmitType(OUser, ['bank']) {
  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  accessUserApp: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OUserBank' })
  @ValidateNested()
  bank: OUserBank;
}

export const OAdminUserSchema = SchemaFactory.createForClass(OAdminUser);

OAdminUserSchema.pre('save', function (next) {
  this.password = hashSync(this.password, 12);
  next();
});
