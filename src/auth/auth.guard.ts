import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { decrypt } from 'src/common/util/encrypt';
import { EUser } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { ErConfig } from 'src/er_app/er_config/schema/er_config.schema';
import { AddonSubscription } from 'src/er_app/subscription/schema/addon_subscription.schema';
import { Subscription } from 'src/er_app/subscription/schema/subscription.schema';
import { Organization } from 'src/organization/schema/organization.schema';
import { Permission } from 'src/permission/permission.schema';
import { User } from 'src/user/schema/user.schema';
import { AllowedAddon } from './addon.decorator';
import { AllowedUser } from './user.decorator';
import { Position } from 'src/position/schema/position.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>,
    @InjectModel(AddonSubscription.name) private readonly addonSubscriptionModel: Model<AddonSubscription>,
    @InjectModel(ErConfig.name) private readonly erConfigModel: Model<ErConfig>,
    @InjectModel(Organization.name) private readonly organizationModel: Model<Organization>,
    @InjectModel(Position.name) private readonly positionModel: Model<Position>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const allowedUsers = this.reflector?.get<AllowedUser[]>('users', context.getHandler());
    const addons = this.reflector?.get<AllowedAddon>('addons', context.getHandler());

    const httpCtx = context.switchToHttp();
    const req: AppRequest = httpCtx.getRequest();
    const path = req.path;
    let id, type, user: User, permission: Permission, orgainzation: Organization, superAdmin: boolean;

    if (req.cookies.user) {
      ({ id, type } = await decrypt(process.env.ENC_PASSWORD, req.cookies.user));

      user = await this.userModel.findById(id, null, { lean: true });
      if (type === EUser.ErApp && !user.accessErApp)
        throw new ForbiddenException("User don't have access to ER App");
      if (user.currentOrganization)
        permission = (
          await this.positionModel.findById(user.currentOrganization.positionId, null, {
            lean: true,
            populate: ['permission'],
          })
        ).permission;

      req.id = id;
      req.type = type;
      req.user = user;
      req.permission = permission;
      if (type === EUser.ErApp) {
        const config = await this.erConfigModel.findById(process.env.CONFIG_ID, null, {
          lean: true,
          populate: ['superAdmin'],
        });
        req.config = config;
      } else {
        orgainzation = await this.organizationModel.findById(user.currentOrganization.organizationId, null, {
          lean: true,
          populate: 'config',
        });
        req.config = orgainzation.config;
      }
      superAdmin = req.config.superAdmin._id.equals(req.user._id);
      req.superAdmin = superAdmin;
    }

    if (allowedUsers) {
      if (!req.cookies.user) return false;

      if (EUser.ErApp && !allowedUsers.includes(EUser.ErApp || EUser.Any)) return false;
      if (EUser.Organization && !allowedUsers.includes(EUser.Organization || EUser.Any || EUser.InActive))
        return false;
      const allowedInActive = allowedUsers.some((each) => each === EUser.InActive || each === EUser.Any);

      if (!allowedInActive && !user.currentOrganization) return false;

      let activeSubscription: Subscription;
      if (user.currentOrganization)
        activeSubscription = await this.subscriptionModel.findOne(
          { active: true, organization: orgainzation._id },
          null,
        );
      if (activeSubscription) {
        if (new Date(activeSubscription.activeUntil).getTime() < Date.now()) {
          this.subscriptionModel.findByIdAndUpdate(orgainzation._id, {
            $set: { active: false },
          });
          if (!allowedInActive) throw new ForbiddenException('Subscription is expired');
        }
      } else if (!allowedInActive) throw new ForbiddenException('No active subscription');
      if (addons) {
        const subscriptedAddons = await this.addonSubscriptionModel.find({
          addon: { $in: addons },
          $or: [{ allowedUsers: { $eleMatch: id } }, { allowEveryEmployee: true }],
        });
        return !!subscriptedAddons.length;
      }

      if (allowedUsers.includes(EUser.Any)) return true;
      if (superAdmin) return true;
      if (permission) permission.allowedRoutes.includes(path);
      else false;
    }

    return true;
  }
}
