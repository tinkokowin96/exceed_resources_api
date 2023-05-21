import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { User } from 'src/user/schema/user.schema';
import { Currency } from './currency.schema';

@Schema()
export class ErConfig extends CoreSchema {
  @Prop({ type: [String], required: true })
  @IsNotEmpty()
  @IsString({ each: true })
  restrictedRoutes: string[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  superAdmin: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Currency' })
  baseCurrency: Currency;
}

export const ErConfigSchema = SchemaFactory.createForClass(ErConfig);
