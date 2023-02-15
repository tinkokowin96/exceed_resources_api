import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { OAdminUserBank } from 'src/bank/schema/o_admin_user_bank.schema';
import { OUserBank } from 'src/bank/schema/o_user_bank.schema';
import { UserService } from 'src/common/service/user.service';
import { EModule, ESubscriptionStatus, EUser } from 'src/common/util/enumn';
import { Organization } from 'src/organization/schema/organization.schema';
import { Project } from 'src/project/schema/project.schema';
import { CreateOUserDto } from '../dto/create_o_user.dto';
import { LoginOUserDto } from '../dto/login_o_user.dto';
import { OUser } from '../schema/o_user.schema';

@Injectable()
export class OUserService extends UserService {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(OUser.name) model: Model<OUser>,
    @InjectModel(Organization.name) private readonly organizationModel: Model<Organization>,
    @InjectModel(OUserBank.name) private readonly oUserBankModel: Model<OUserBank>,
    @InjectModel(OAdminUserBank.name) private readonly oAdminUserBankModel: Model<OAdminUserBank>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {
    super(connection, model);
  }

  async createAccount(
    { bankId, currentOrganizationId, projectIds, associatedOrganizationIds, ...dto }: CreateOUserDto,
    type: EUser.OAdmin | EUser.Organization,
    res: Response,
  ) {
    return this.makeTransaction({
      action: async () => {
        if (!type) throw new BadRequestException('Require user type');
        let bank, currentOrganization, projects, associatedOrganizations;
        if (bankId) {
          if (type === EUser.Organization)
            bank = await this.findById(bankId, this.oUserBankModel, { _id: bankId });
          else bank = await this.findById(bankId, this.oAdminUserBankModel, { _id: bankId });
        }
        if (currentOrganizationId)
          currentOrganization = await this.findById(currentOrganizationId, this.organizationModel, {
            _id: 1,
          });
        if (projectIds)
          projects = await this.find({ _id: { $in: projectIds } }, this.projectModel, { _id: 1 });
        if (associatedOrganizationIds)
          associatedOrganizations = await this.find(
            { _id: { $in: associatedOrganizationIds } },
            this.organizationModel,
            {
              _id: 1,
            },
          );
        return await this.create({
          ...dto,
          type,
          bank,
          currentOrganization,
          projects,
          associatedOrganizations,
        });
      },
      res,
      audit: {
        name: 'o-user_create',
        module: EModule.OUser,
        payload: dto,
      },
    });
  }

  async loginAccount(dto: LoginOUserDto, res: Response) {
    return this.makeTransaction({
      action: async () =>
        await this.login({
          dto,
          populate: [dto.organizationId && 'currentOrganization'],
          callback: async (user: OUser) => {
            let organization: Organization;
            if (dto.organizationId) organization = await this.organizationModel.findById(dto.organizationId);
            else organization = user.currentOrganization.organization;
            const organizationFound = user.associatedOrganizations.filter(
              (each) => each.organization._id === organization._id,
            )[0];
            if (!organization || !organizationFound) throw new BadRequestException('Organization not found');
            if (organization.activeSubscription.status !== ESubscriptionStatus.Active)
              throw new ForbiddenException('Organization subscription is inactive or expired');
            if (!organizationFound.superAdmin && !organizationFound.permission)
              throw new ForbiddenException('No permission attached for user');
            const cookies = {};
            cookies['superAdmin'] = organizationFound.superAdmin;
            cookies['type'] = EUser.Organization;
            cookies['organizationId'] = organizationFound._id;
            return cookies;
          },
          res,
        }),
      res,
      audit: {
        name: 'o-user_login',
        module: EModule.OUser,
        payload: dto,
      },
    });
  }
}
