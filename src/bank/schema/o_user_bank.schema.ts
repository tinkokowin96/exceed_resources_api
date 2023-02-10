import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { OUser } from 'src/o_user/schema/o_user.schema';
import { Bank } from './bank.schema';

//TODO: add ouser transaction
export class OUserBank extends Bank {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'OUser' })
  @ValidateNested()
  user: OUser;
}

export const OUserBankSchema = SchemaFactory.createForClass(OUserBank);
