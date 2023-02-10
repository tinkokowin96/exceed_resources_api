import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserSchema } from '../user.shema';

export class ChangePasswordDto extends PickType(UserSchema, [
    'email',
    'password',
]) {
    @IsNotEmpty()
    @IsString()
    newPassword: string;
}
