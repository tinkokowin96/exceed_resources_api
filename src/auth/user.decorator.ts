import { SetMetadata } from '@nestjs/common';
import { EUser } from 'src/common/util/enumn';

export type AllowedUser = keyof typeof EUser | 'Addon';
export const Users = (users: AllowedUser[]) => SetMetadata('users', users);
