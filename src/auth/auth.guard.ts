import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { decrypt } from 'src/common/util/encrypt';
import { EUser } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { ErConfig } from 'src/er_app/schema/er_config.schema';
import { ErUser } from 'src/er_app/schema/er_user.schema';
import { Organization } from 'src/organization/schema/organization.schema';
import { OConfig } from 'src/organization/schema/o_config.schema';
import { OUser } from 'src/o_user/schema/o_user.schema';
import { AddonSubscription } from 'src/subscription/schema/addon_subscription.schema';
import { Subscription } from 'src/subscription/schema/subscription.schema';
import { AllowedAddon } from './addon.decorator';
import { AllowedUser } from './user.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(ErUser.name) private readonly erUserModel: Model<ErUser>,
    @InjectModel(OUser.name) private readonly oUserModel: Model<OUser>,
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
    let user, id, type;

    if (req.cookies.user) {
      ({ id, type } = await decrypt(process.env.ENC_PASSWORD, req.cookies.user));
      req.id = id;

      if (type === EUser.ErApp) {
        user = await this.erUserModel
          .findById(id, null, { lean: true })
          .populate('permission', 'allowedRoutes');
        const config = await this.erConfigModel.findById(process.env.CONFIG_ID, null, {
          lean: true,
        });

        req.user = user;
        req.config = config;

        if (!user.active) throw new ForbiddenException('User is not active');
      } else {
        user = await this.oUserModel.findById(id, null, { lean: true }).populate({
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

        req.user = user;
        if (user.currentOrganization) {
          const config = await this.oConfigModel.findOne({ organization: user.currentOrganization._id });
          req.config = config;
        }
      }
    }

    if (allowedUsers) {
      if (!req.cookies.user) return false;
      if (type === EUser.ErApp) {
        if (!allowedUsers.includes(EUser.ErApp)) return false;

        if (!user.active) throw new ForbiddenException('User is not active');
        if (user.superAdmin) return true;
        return user.permission.allowedRoutes.includes(url);
      } else {
        const allowedInActive = allowedUsers.some((each) => each === EUser.OInActive || each === EUser.OAny);

        if (!allowedInActive && !user.currentOrganization) return false;

        let activeSubscription: Subscription;
        if (user.currentOrganization)
          activeSubscription = await this.subscriptionModel.findOne(
            { active: true, organizations: user.currentOrganization._id },
            null,
          );
        if (activeSubscription) {
          if (new Date(activeSubscription.activeUntil).getTime() < Date.now()) {
            this.subscriptionModel.findByIdAndUpdate(user.currentOrganization.id, {
              $set: { active: false },
            });
            if (!allowedInActive) throw new ForbiddenException('Subscription is expired');
          }
        } else if (!allowedInActive) throw new ForbiddenException('No active subscription');
        if (addons) {
          const subscriptedAddons = await this.addonSubscriptionModel.find({
            addon: { $in: addons },
            $or: [{ allowedOUsers: { $eleMatch: id } }, { allowEveryEmployee: true }],
          });
          return !!subscriptedAddons.length;
        }

        if (allowedUsers.includes(EUser.OAny)) return true;
        if (user.currentOrganization.superAdmin) return true;
        return user.currentOrganization.permission.allowedRoutes.includes(url);
      }
    }

    return true;
  }
}
