import { SetMetadata } from '@nestjs/common';
import { EUser } from 'src/core/util/enumn';

export type AllowedUser = keyof typeof EUser;
export const Users = (users: AllowedUser[] | 'Addon') => SetMetadata('users', users);
