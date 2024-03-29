import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch } from 'src/branch/branch.schema';
import { decrypt } from 'src/core/util/encrypt';
import { EUser } from 'src/core/util/enumn';
import { AppRequest } from 'src/core/util/type';
import { ErConfig } from 'src/er_config/schema/er_config.schema';
import { OSubscription } from 'src/o_subscription/o_subscription.schema';
import { OConfig } from 'src/organization/schema/o_config.schema';
import { Organization } from 'src/organization/schema/organization.schema';
import { Position } from 'src/position/position.schema';
import { User } from 'src/user/schema/user.schema';
import { AllowedUser } from './user.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(OSubscription.name) private readonly subscriptionModel: Model<OSubscription>,
    @InjectModel(ErConfig.name) private readonly erConfigModel: Model<ErConfig>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const allowedUsers = this.reflector?.get<AllowedUser[] | 'Addon'>('users', context.getHandler());

    const httpCtx = context.switchToHttp();
    const req: AppRequest = httpCtx.getRequest();
    const path = req.path;
    let id, type, user: User, orgainzation: Organization;

    if (req.cookies.user) {
      ({ id, type } = await decrypt(process.env.ENC_PASSWORD, req.cookies.user));
      user = await this.userModel.findById(id, null, { lean: true }).populate({
        path: 'currentOrganization',
        populate: [
          {
            path: 'branch',
            model: Branch.name,
            populate: [
              { path: 'config', model: OConfig.name },
              { path: 'organization', model: Organization.name },
            ],
          },
          {
            path: 'position',
            model: Position.name,
          },
        ],
      });
      if (type === EUser.ErApp && !user.accessErApp)
        throw new ForbiddenException("User don't have access to ER App");
      orgainzation = user.currentOrganization.branch.organization;
      if (!orgainzation.approved)
        throw new ForbiddenException("Organization hasn't approved, please contact support");
      req.id = id;
      req.type = type;
      req.user = user;
      if (type === EUser.ErApp) {
        const config = await this.erConfigModel.findById(process.env.CONFIG_ID, null, {
          lean: true,
          populate: ['superAdmin'],
        });

        req.config = config;
      } else req.config = user.currentOrganization.branch.config;
      req.superAdmin = orgainzation.superAdmin._id.equals(req.user._id);
    }

    if (allowedUsers) {
      if (!req.cookies.user) return false;

      const addonUser = allowedUsers === 'Addon';
      const allowedInActive =
        !addonUser && allowedUsers.some((each) => each === EUser.InActive || each === EUser.Any);
      const allowErApp =
        !addonUser && allowedUsers.some((each) => each === EUser.ErApp || each === EUser.Any);
      const allowOrganization =
        !addonUser && allowedUsers.some((each) => each === EUser.Organization || allowedInActive);

      if (type === EUser.ErApp && !allowErApp) return false;
      if (type === EUser.Organization && !allowOrganization) return false;
      if (!allowedInActive && !orgainzation) return false;

      const subscription = await this.subscriptionModel.findOne(
        {
          users: { $eleMatch: user._id },
          isAddon: addonUser,
          'subscription.allowedRouter': addonUser
            ? {
                $eleMatch: { path },
              }
            : undefined,
        },
        null,
        { populate: 'subscription' },
      );

      if (subscription) {
        if (new Date(subscription.activeUntil).getTime() < Date.now()) {
          this.subscriptionModel.findByIdAndUpdate(orgainzation._id, {
            $set: { active: false },
          });
          if (!allowedInActive) throw new ForbiddenException('Subscription is expired');
        }
      } else if (!allowedInActive) throw new ForbiddenException('No active subscription');

      if (allowedUsers.includes(EUser.Any)) return true;
      if (req.superAdmin) return true;
      if (addonUser) return true;
      return req.user.currentOrganization.position.allowedRoutes.includes(path);
    }

    return true;
  }
}
