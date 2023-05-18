import { Request } from 'express';
import { ClientSession } from 'mongoose';
import { ErConfig } from 'src/er_app/er_config/schema/er_config.schema';
import { OConfig } from 'src/organization/schema/o_config.schema';
import { User } from 'src/user/schema/user.schema';
import { EUser } from './enumn';

export interface AppRequest extends Request {
  id: string;
  type: EUser;
  user: User;
  config: ErConfig | OConfig;
  superAdmin: boolean;
}

export type ServiceTrigger = {
  triggerBy: string;
  session: ClientSession;
};
