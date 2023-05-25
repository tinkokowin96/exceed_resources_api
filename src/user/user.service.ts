import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { compareSync } from 'bcryptjs';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { Bank } from 'src/bank/schema/bank.schema';
import { CoreService } from 'src/common/service/core.service';
import { encrypt } from 'src/common/util/encrypt';
import { EModule, EServiceTrigger, EUser } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { DepartmentService } from 'src/department/department.service';
import { Organization } from 'src/organization/schema/organization.schema';
import { Position } from 'src/position/schema/position.schema';
import {
  AddAssociatedOrganizationDto,
  CreateUserDto,
  GetUsersDto,
  LoginUserDto,
  ToggleErAppAccessDto,
} from './dto/user.dto';
import { User } from './schema/user.schema';
import { OAssociated } from 'src/organization/schema/o_associated.schema';

@Injectable()
export class UserService extends CoreService {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(User.name) model: Model<User>,
    @InjectModel(Organization.name) private readonly organizationModel: Model<Organization>,
    @InjectModel(Bank.name) private readonly bankModel: Model<Bank>,
    @InjectModel(Position.name) private readonly positionModel: Model<Position>,
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
          breaks,
          departments: departmentsDto,
          ...payload
        } = dto;
        let bank, position;
        const departments = [];
        if (bankId)
          bank = await this.findById({ id: bankId, custom: this.bankModel, projection: { _id: 1 } });
        if (req.type === EUser.ErApp && (!positionId || !departmentsDto))
          throw new BadRequestException('Require position and department to create a user');
        if (positionId)
          position = await this.findById({
            id: positionId,
            custom: this.positionModel,
            projection: { _id: 1 },
          });
        const user = await this.create({ dto: { bank, position, ...payload }, session });
        for (const dep of departmentsDto) {
          const department = await this.departmentService.addUser({ ...dep, userId: user._id }, req, res, {
            triggerBy: 'create-user',
            session,
            type: EServiceTrigger.Update,
          });
          departments.push(department);
        }
        const associatedOrganization: OAssociated = {
          accessOAdminApp,
          flexibleWorkingHour,
        };
        // return await this.create({
        //   dto: {
        //     ...dto,
        //     type: EUser.Organization,
        //     bank,
        //     currentOrganization,
        //     projects,
        //     associatedOrganizations,
        //   },
        //   session,
        // });
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
