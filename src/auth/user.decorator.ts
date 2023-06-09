import { SetMetadata } from '@nestjs/common';
import { EUser } from 'src/common/util/enumn';

export type AllowedUser = keyof typeof EUser;
export const Users = (users: AllowedUser[] | 'Addon') => SetMetadata('users', users);
