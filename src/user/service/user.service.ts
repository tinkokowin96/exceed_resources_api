import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { compareSync } from 'bcryptjs';
import { Response } from 'express';
import { Connection, Document, Model } from 'mongoose';
import { Bank } from 'src/bank/bank.schema';
import { Branch } from 'src/branch/branch.schema';
import { CoreService } from 'src/core/service/core.service';
import { encrypt } from 'src/core/util/encrypt';
import { EModule, EUser } from 'src/core/util/enumn';
import { AppRequest } from 'src/core/util/type';
import { OSubscription } from 'src/o_subscription/o_subscription.schema';
import { OAssociated } from 'src/organization/schema/o_associated.schema';
import { Organization } from 'src/organization/schema/organization.schema';
import { OAssociatedService } from 'src/organization/service/o_associated.service';
import {
  AddAssociatedOrganizationDto,
  CreateUserDto,
  GetUsersDto,
  LoginUserDto,
  ToggleErAppAccessDto,
} from '../dto/user.dto';
import { User } from '../schema/user.schema';

@Injectable()
export class UserService extends CoreService<User> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(User.name) model: Model<User>,
    @InjectModel(Organization.name) private readonly organizationModel: Model<Organization>,
    @InjectModel(Bank.name) private readonly bankModel: Model<Bank>,
    @InjectModel(OSubscription.name) private readonly oSubscriptionModel: Model<OSubscription>,
    private readonly oAssociatedService: OAssociatedService,
  ) {
    super(connection, model);
  }

  async createUser(dto: CreateUserDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const { bankId, subscriptionIds, orgainzationDto, ...payload } = dto;
        let bank: Bank;

        if (bankId)
          bank = await this.findById({ id: bankId, custom: this.bankModel, projection: { _id: 1 } });

        if ((!req.user && payload.accessErApp) || (req.type !== EUser.ErApp && payload.accessErApp))
          throw new ForbiddenException('Not allow to access erapp');

        if (subscriptionIds && !req.user)
          throw new ForbiddenException("Can't create user with subscription without logging in");

        const subscriptions = (
          await this.find({
            filter: {
              $and: [
                { _id: { $in: subscriptionIds } },
                { organization: req.user.currentOrganization.branch.organization._id },
              ],
            },
            custom: this.oSubscriptionModel,
          })
        ).items;

        const oAssociated: Document<unknown, any, OAssociated> & OAssociated =
          await this.oAssociatedService.createOAssociated(orgainzationDto, req, res, {
            service: 'create-user',
            session,
          });

        const associatedOrganization = await oAssociated.populate([
          {
            path: 'branch',
            model: Branch.name,
            select: ['organization'],
            populate: [{ path: 'organization', model: Organization.name, select: ['config'] }],
          },
        ]);

        const user = await this.create({
          dto: {
            ...payload,
            bank,
            currentOrganization: associatedOrganization,
            associatedOrganizations: [associatedOrganization],
          },
          session,
        });

        for (const sub of subscriptions) {
          if (sub.usedSlot === sub.numSlot)
            throw new BadRequestException('All subscription slots have been used');
          await this.findAndUpdate({
            id: sub.id,
            update: { $inc: { usedSlot: 1 }, $push: { users: user } },
            session,
            custom: this.oSubscriptionModel,
          });
        }

        if (!req.user)
          await this.findAndUpdate({
            id: associatedOrganization.branch.organization.config as any,
            update: { $set: { superAdmin: user } },
            custom: this.organizationModel,
            session,
          });
        return user;
      },
      req,
      res,
      audit: {
        name: 'create-user',
        module: EModule.User,
        payload: dto,
      },
    });
  }

  async loginUser(dto: LoginUserDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async () => {
        const { erUser, userName, email, password } = dto;
        const user = await this.findOne({
          filter: { $or: [{ userName }, { email }] },
          options: { lean: false },
        });
        const matchPassword = compareSync(password, user.password);
        if (!user || !matchPassword) throw new NotFoundException('Wrong userName or password');

        if (erUser && !user.accessErApp) throw new ForbiddenException("User don't have access to ER App");

        if (user.loggedIn) throw new BadRequestException('User already logged in');

        if (user.blocked) throw new ForbiddenException(`User is blocker for ${user.blockReason}`);

        const encrypted = await encrypt(
          process.env.ENC_PASSWORD,
          JSON.stringify({
            id: user._id,
            type: erUser ? EUser.ErApp : EUser.Organization,
          }),
        );

        const max_age = 15 * 24 * 60 * 60 * 1000;
        res.cookie('user', encrypted, {
          httpOnly: true,
          maxAge: max_age,
        });

        await user.updateOne({ $set: { loggedIn: true } });
        return 'Successfully logged in';
      },
      res,
      req,
      audit: {
        name: 'login-user',
        module: EModule.User,
        payload: dto,
      },
    });
  }

  async toggleErAppAccess({ id, accessErApp }: ToggleErAppAccessDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) =>
        await this.findAndUpdate({
          id,
          update: {
            $set: { accessErApp },
          },
          session,
        }),
      req,
      res,
      audit: {
        name: 'toggle-erapp-access',
        module: EModule.User,
      },
    });
  }

  async logoutUser(req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async () => {
        const user = await this.findById({ id: req.user._id, options: { lean: false } });
        await user.updateOne({ $set: { loggedIn: false } });
        res.clearCookie('user');
        return 'Successfully logged out';
      },
      req,
      res,
      audit: {
        name: 'logout-user',
        module: EModule.User,
      },
    });
  }

  async getUsers({ organizationId, ...pagination }: GetUsersDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async () => {
        if (req.type !== EUser.ErApp && organizationId)
          throw new ForbiddenException("Can't access other organization or user");

        return this.find({
          filter: {
            currentOrganization: {
              $eleMatch: {
                orgainzation: organizationId ?? req.user.currentOrganization.branch.organization._id,
              },
            },
          },
          ...pagination,
        });
      },
      req,
      res,
      audit: { name: 'get-users', module: EModule.User },
    });
  }

  async addAssociatedOrganization(dto: AddAssociatedOrganizationDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const { userIds, isCurrentOrganization, orgainzation } = dto;
        const update = { $addToSet: { associatedOrganizations: orgainzation } };
        if (isCurrentOrganization) update['$set'] = { currentOrganization: orgainzation };
        return await this.updateMany({ filter: { _id: { $in: userIds } }, session, update });
      },
      req,
      res,
      audit: {
        name: 'add-associated-organization',
        module: EModule.User,
        payload: dto,
      },
    });
  }
}
