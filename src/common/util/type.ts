import { Request } from 'express';
import { ErConfig } from 'src/er_config/schema/er_config.schema';
import { OConfig } from 'src/organization/schema/o_config.schema';
import { User } from 'src/user/schema/user.schema';
import { EUser } from './enumn';

export type Type<K, T> = K extends T ? T : K;

export interface AppRequest extends Request {
  id: string;
  type: EUser;
  user: User;
  config: ErConfig | OConfig;
  superAdmin: boolean;
}
