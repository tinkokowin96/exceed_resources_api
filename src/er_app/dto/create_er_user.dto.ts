import { OmitType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { ErUser } from '../schema/er_user.schema';

export class CreateErUserDto extends OmitType(ErUser, ['active', 'permission', 'bank', 'loggedIn']) {
  @IsString()
  bankId: string;
}
