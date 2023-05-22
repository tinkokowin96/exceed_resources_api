import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { compareSync } from 'bcryptjs';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { Bank } from 'src/bank/schema/bank.schema';
import { CoreService } from 'src/common/service/core.service';
import { encrypt } from 'src/common/util/encrypt';
import { EModule, EUser } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { Organization } from 'src/organization/schema/organization.schema';
import { Project } from 'src/project/schema/project.schema';
import { CreateUserDto, GetUsersDto, LoginUserDto, ToggleErAppAccessDto } from './dto/user.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UserService extends CoreService {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(User.name) model: Model<User>,
    @InjectModel(Organization.name) private readonly organizationModel: Model<Organization>,
    @InjectModel(Bank.name) private readonly bankModel: Model<Bank>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {
    super(connection, model);
  }

  async createUser(
    { bankId, currentOrganizationId, projectIds, associatedOrganizationIds, ...dto }: CreateUserDto,
    req: AppRequest,
    res: Response,
  ) {
    return this.makeTransaction({
      action: async (session) => {
        let bank, currentOrganization, projects, associatedOrganizations;
        if (bankId)
          bank = await this.findById({ id: bankId, custom: this.bankModel, projection: { _id: 1 } });
        if (currentOrganizationId)
          currentOrganization = await this.findById({
            id: currentOrganizationId,
            custom: this.organizationModel,
            projection: { _id: 1 },
          });
        if (projectIds)
          projects = await this.find({
            filter: { _id: { $in: projectIds } },
            custom: this.projectModel,
            projection: { _id: 1 },
          });
        if (associatedOrganizationIds)
          associatedOrganizations = await this.find({
            filter: { _id: { $in: associatedOrganizationIds } },
            custom: this.organizationModel,
            projection: { _id: 1 },
          });
        return await this.create({
          dto: {
            ...dto,
            type: EUser.Organization,
            bank,
            currentOrganization,
            projects,
            associatedOrganizations,
          },
          session,
        });
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
        await this.findByIdAndUpdate({
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

  async getUsers(
    { erAppUsers, oAdminAppUsers, organizationId, take, page, sort }: GetUsersDto,
    req: AppRequest,
    res: Response,
  ) {
    return this.makeTransaction({
      action: async () => {
        const opt: any = {};
        if (take)
          opt['pagination'] = {
            take,
            page,
          };
        if (sort) opt['sort'] = sort;
        const filter: any = {};
        if (erAppUsers) filter['accessErApp'] = true;

        if (oAdminAppUsers && !organizationId)
          throw new BadRequestException('Require orgainzation id to get organization admin app users');
        return await this.find({ filter: {}, ...opt });
      },
      req,
      res,
      audit: { name: 'get-users', module: EModule.User },
    });
  }
}
