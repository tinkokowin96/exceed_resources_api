import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { intersection } from 'lodash';
import { Model } from 'mongoose';
import { decrypt } from 'src/common/util/encrypt';
import { EUser } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { ErConfig } from 'src/er_app/schema/er_config.schema';
import { OConfig } from 'src/organization/schema/o_config.schema';
import { Permission } from 'src/permission/permission.schema';
import { AllowedAddon } from './addon.decorator';
import { AllowedUser } from './user.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(Permission.name) private readonly permissionModel: Model<Permission>,
    @InjectModel(ErConfig.name) private readonly erConfigModel: Model<ErConfig>,
    @InjectModel(OConfig.name) private readonly oConfigModel: Model<OConfig>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const users = this.reflector?.get<AllowedUser>('users', context.getHandler());
    const addons = this.reflector?.get<AllowedAddon>('addons', context.getHandler());

    const httpCtx = context.switchToHttp();
    const req: AppRequest = httpCtx.getRequest();
    const url = req.protocol + '://' + req.get('Host') + req.originalUrl;
    // const url = req.protocol + '://' + req.host+req.originalUrl; when port don't need

    if (users) {
      if (!req.cookies.user) return false;
      const {
        id,
        type,
        permissionId,
        companyId,
        superAdmin,
        addons: userAddons,
      } = await decrypt(process.env.ENC_PASSWORD, req.cookies.user);

      if (type === EUser.ErApp) {
        if (!users.includes(EUser.ErApp)) return false;

        const config = await this.erConfigModel.findById(process.env.CONFIG_ID, null, {
          lean: true,
        });
        req.config = config;
      } else {
        if (type === EUser.OAdmin && !users.includes(EUser.OAdmin)) return false;
        if (type === EUser.Organization && !users.includes(EUser.Organization)) return false;
        const config = await this.oConfigModel.findOne({ company: companyId }, null, {
          lean: true,
        });
        req.config = config;
      }
      req.user = type;
      req.superAdmin = superAdmin;
      req.id = id;

      const permission = await this.permissionModel.findById(permissionId, null, { lean: true });
      req.permission = permission;

      if (superAdmin) return true;
      if (addons) return !!intersection(addons, userAddons).length;
      return permission.allowedRoutes.includes(url);
    }
    return true;
  }
}
