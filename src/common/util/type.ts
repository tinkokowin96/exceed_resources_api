import { Request } from 'express';
import { ErConfig } from 'src/er_app/schema/er_config.schema';
import { OConfig } from 'src/organization/schema/o_config.schema';
import { Permission } from 'src/permission/permission.schema';
import { EModule, EUser } from './enumn';

export interface AppRequest extends Request {
  id: string;
  user: EUser;
  permission: Permission;
  config: ErConfig | OConfig;
}

export type AuditType = {
  name: string;
  module: EModule;
  payload?: any;
  prev?: any;
  next?: any;
};
