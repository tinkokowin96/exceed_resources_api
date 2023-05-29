import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { compareSync } from 'bcryptjs';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { Bank } from 'src/bank/schema/bank.schema';
import { Break } from 'src/break/schema/break.schema';
import { CoreService } from 'src/common/service/core.service';
import { encrypt } from 'src/common/util/encrypt';
import { EModule, EServiceTrigger, EUser } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { DepartmentService } from 'src/department/department.service';
import { OAssociated } from 'src/organization/schema/o_associated.schema';
import { OConfig } from 'src/organization/schema/o_config.schema';
import { Organization } from 'src/organization/schema/organization.schema';
import { Permission } from 'src/permission/permission.schema';
import { Position } from 'src/position/schema/position.schema';
import {
  AddAssociatedOrganizationDto,
  CreateUserDto,
  GetUsersDto,
  LoginUserDto,
  ToggleErAppAccessDto,
} from './dto/user.dto';
import { User } from './schema/user.schema';
import { Department } from 'src/department/schema/department.schema';

@Injectable()
export class UserService extends CoreService<User> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(User.name) model: Model<User>,
    @InjectModel(Organization.name) private readonly organizationModel: Model<Organization>,
    @InjectModel(OConfig.name) private readonly oConfigModel: Model<OConfig>,
    @InjectModel(Bank.name) private readonly bankModel: Model<Bank>,
    @InjectModel(Position.name) private readonly positionModel: Model<Position>,
    @InjectModel(Permission.name) private readonly permissionModel: Model<Permission>,
    @InjectModel(Break.name) private readonly breakModel: Model<Break>,
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    private readonly departmentService: DepartmentService,
  ) {
    super(connection, model);
  }

  async createUser(dto: CreateUserDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const {
          bankId,
          accessOAdminApp,
          flexibleWorkingHour,
          remark,
          checkInTime,
          checkOutTime,
          positionId,
          breakIds,
          organizationId,
          departments: departmentsDto,
          ...payload
        } = dto;
        let bank: Bank, orgainzation: Organization, position: Position;
        if (req.user && (organizationId || positionId))
          throw new ForbiddenException("Can't create user for other organization");

        if (bankId)
          bank = await this.findById({ id: bankId, custom: this.bankModel, projection: { _id: 1 } });

        if ((!req.user && payload.accessErApp) || (req.type !== EUser.ErApp && payload.accessErApp))
          throw new ForbiddenException('Not allow to use user to access erapp');

        if (!req.user) {
          if (!organizationId)
            throw new BadRequestException('Require organization id to create owner account');
          orgainzation = await this.findById({
            id: organizationId,
            custom: this.organizationModel,
            projection: { _id: 1 },
            options: { populate: { path: 'config', select: '_id' } },
          });
          const users = await this.find({
            filter: {
              currentOrganization: { orgainzation: orgainzation._id },
            },
          });
          if (users.items.length) throw new ForbiddenException('Organization already had owner account');
          const permission = await this.create({
            dto: { name: `${orgainzation.name} owner permission` },
            session,
            custom: this.permissionModel,
          });
          position = await this.create({
            dto: { name: `${orgainzation.name} Owner`, shortName: 'Owner', permission, basicSalary: 0 },
            session,
            custom: this.positionModel,
          });
        } else {
          orgainzation = req.user.currentOrganization.organization;
          position = req.user.currentOrganization.position;
        }

        const breaks = (
          await this.find({
            filter: { $or: [{ _id: { $in: breakIds } }, { orgainzation: orgainzation._id }] },
            custom: this.breakModel,
            projection: { _id: 1 },
          })
        ).items.reduce((acc, cur) => [...acc, cur._id], []);

        const departments = departmentsDto
          ? (
              await this.find({
                filter: { _id: { $in: departmentsDto.reduce((acc, cur) => [...acc, cur.departmentId], []) } },
                projection: { _id: 1 },
                custom: this.departmentModel,
              })
            ).items.reduce((acc, cur) => [...acc, cur._id], [])
          : [];

        const associatedOrganization: OAssociated = {
          accessOAdminApp,
          flexibleWorkingHour,
          remark,
          checkInTime,
          checkOutTime,
          organization: orgainzation._id as any,
          position: position._id as any,
          breaks,
          departments,
        };

        const user = await this.create({
          dto: {
            ...payload,
            basicSalary: payload.basicSalary ?? position.basicSalary,
            bank,
            currentOrganization: associatedOrganization,
            associatedOrganizations: [associatedOrganization],
          },
          session,
        });

        if (departmentsDto)
          for (const dep of departmentsDto) {
            if (dep.isHead)
              await this.departmentService.changeDepartmentHead(
                { ...dep, userId: user._id.toString() },
                req,
                res,
                {
                  triggerBy: 'create-user',
                  session,
                  type: EServiceTrigger.Update,
                },
              );
          }

        if (!req.user)
          await this.findByIdAndUpdate({
            id: orgainzation.config._id,
            update: { $set: { superAdmin: user } },
            custom: this.oConfigModel,
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

  async getUsers({ organizationId, ...pagination }: GetUsersDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async () => {
        if (req.type !== EUser.ErApp && !req.user.currentOrganization.organization._id.equals(organizationId))
          throw new ForbiddenException("Can't access other organization or user");

        return this.find({
          filter: {
            currentOrganization: {
              $eleMatch: {
                orgainzation: organizationId ?? req.user.currentOrganization.organization._id,
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
        return await this.updateManyById({ ids: userIds, session, update });
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
