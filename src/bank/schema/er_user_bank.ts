import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { ErUser } from 'src/er_app/schema/er_user.schema';
import { Bank } from './bank.schema';

//TODO: add eruser transaction
export class ErUserBank extends Bank {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'ErUser' })
  @ValidateNested()
  user: ErUser;
}

export const ErUserBankSchema = SchemaFactory.createForClass(ErUserBank);
