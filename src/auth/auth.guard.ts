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
import { OConfig } from 'src/organization/schema/o_config.schema';
import { Organization } from 'src/organization/schema/organization.schema';
import { User } from 'src/user/schema/user.schema';
import { AllowedAddon } from './addon.decorator';
import { AllowedUser } from './user.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    // @InjectModel(ErUser.name) private readonly erUserModel: Model<ErUser>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>,
    @InjectModel(AddonSubscription.name) private readonly addonSubscriptionModel: Model<AddonSubscription>,
    @InjectModel(ErConfig.name) private readonly erConfigModel: Model<ErConfig>,
    @InjectModel(OConfig.name) private readonly oConfigModel: Model<OConfig>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const allowedUsers = this.reflector?.get<AllowedUser[]>('users', context.getHandler());
    const addons = this.reflector?.get<AllowedAddon>('addons', context.getHandler());

    const httpCtx = context.switchToHttp();
    const req: AppRequest = httpCtx.getRequest();
    const url = req.protocol + '://' + req.get('Host') + req.originalUrl;
    // const url = req.protocol + '://' + req.host+req.originalUrl; when port don't need
    let id, type, user: User, superAdmin: boolean;

    if (req.cookies.user) {
      ({ id, type } = await decrypt(process.env.ENC_PASSWORD, req.cookies.user));
      req.id = id;

      const filter = { _id: id };
      if (type === EUser.ErApp) filter['accessErApp'] = true;
      user = await this.userModel.findOne(filter, null, { lean: true }).populate({
        path: 'currentOrganization',
        populate: [
          {
            path: 'organization',
            model: Organization.name,
          },
          {
            path: 'permission',
            select: 'allowedRoutes assignableRoles',
            model: Organization.name,
          },
        ],
      });
      const config = await this.erConfigModel.findById(process.env.CONFIG_ID, null, {
        lean: true,
      });
      req.type = type;
      req.user = user;
      if (type === EUser.ErApp) req.config = config;

      req.user = user;
      if (user.currentOrganization) {
        const config = await this.oConfigModel.findOne({ organization: user.currentOrganization._id }, null, {
          populate: 'superAdmin',
        });
        req.config = config;
      }
      superAdmin = req.config.superAdmin._id.equals(user._id);
      req.superAdmin = superAdmin;
    }

    if (allowedUsers) {
      if (!req.cookies.user) return false;
      if (type === EUser.ErApp) {
        if (!allowedUsers.includes(EUser.ErApp)) return false;

        if (superAdmin) return true;
        return user.currentOrganization.permission.allowedRoutes.includes(url);
      } else {
        const allowedInActive = allowedUsers.some((each) => each === EUser.InActive || each === EUser.Any);

        if (!allowedInActive && !user.currentOrganization) return false;

        let activeSubscription: Subscription;
        if (user.currentOrganization)
          activeSubscription = await this.subscriptionModel.findOne(
            { active: true, organizations: user.currentOrganization._id },
            null,
          );
        if (activeSubscription) {
          if (new Date(activeSubscription.activeUntil).getTime() < Date.now()) {
            this.subscriptionModel.findByIdAndUpdate(user.currentOrganization._id, {
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
        return user.currentOrganization.permission.allowedRoutes.includes(url);
      }
    }

    return true;
  }
}
