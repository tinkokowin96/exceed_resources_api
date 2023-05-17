import { Request } from 'express';
import { ClientSession } from 'mongoose';
import { ErConfig } from 'src/er_app/er_config/schema/er_config.schema';
import { ErUser } from 'src/er_app/er_user/schema/er_user.schema';
import { OConfig } from 'src/organization/schema/o_config.schema';
import { OUser } from 'src/o_user/schema/o_user.schema';

export interface AppRequest extends Request {
  id: string;
  user: ErUser | OUser;
  config: ErConfig | OConfig;
}

export type ServiceTrigger = {
  triggerBy: string;
  session: ClientSession;
};
