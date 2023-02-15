import { PartialType, PickType } from '@nestjs/mapped-types';
import { UserSchema } from '../schema/user.shema';

export class LoginAccountDto extends PartialType(PickType(UserSchema, ['password', 'userName', 'email'])) {}
