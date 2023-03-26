import { Prop, Schema } from '@nestjs/mongoose';

import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EUser } from '../util/enumn';
import { CoreSchema } from './core.shema';

@Schema()
export class UserSchema extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String })
  @IsString()
  image: string;

  @Prop({ type: String, required: true, unique: true })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @Prop({ type: String, required: true, unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  password: string;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  deleted: boolean;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  loggedIn: boolean;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  blocked: boolean;

  @Prop({ type: String })
  @IsString()
  blockReason: string;

  @Prop({ type: String, enum: EUser, required: true })
  @IsNotEmpty()
  @IsEnum(EUser)
  type: EUser;
}
