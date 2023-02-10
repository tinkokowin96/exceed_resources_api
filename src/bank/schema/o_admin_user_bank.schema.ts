import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { OAdminUser } from 'src/o_admin_app/schema/o_admin_user.schema';
import { Bank } from './bank.schema';

//TODO: add oadminuser transaction
export class OAdminUserBank extends Bank {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'OAdminUser' })
  @ValidateNested()
  user: OAdminUser;
}

export const OAdminUserBankSchema = SchemaFactory.createForClass(OAdminUserBank);
