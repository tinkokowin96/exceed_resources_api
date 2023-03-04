import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { Bank } from 'src/bank/schema/bank.schema';
import { UserService } from 'src/common/service/user.service';
import { EModule, EUser } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { Organization } from 'src/organization/schema/organization.schema';
import { Project } from 'src/project/schema/project.schema';
import { CreateEmployeeDto, CreateOwnerDto } from '../dto/create_o_user.dto';
import { OUser } from '../schema/o_user.schema';

@Injectable()
export class OUserService extends UserService {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(OUser.name) model: Model<OUser>,
    @InjectModel(Organization.name) private readonly organizationModel: Model<Organization>,
    @InjectModel(Bank.name) private readonly bankModel: Model<Bank>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {
    super(connection, model);
  }

  async createOwner(dto: CreateOwnerDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        return await this.create({
          dto: {
            ...dto,
            joiningDate: new Date(),
            type: EUser.Organization,
          },
          session,
        });
      },
      res,
      req,
      audit: {
        name: 'o-user_create-owner',
        module: EModule.OUser,
        payload: dto,
      },
    });
  }

  async createEmployee(
    { bankId, currentOrganizationId, projectIds, associatedOrganizationIds, ...dto }: CreateEmployeeDto,
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
        name: 'o-user_create-employee',
        module: EModule.OUser,
        payload: dto,
      },
    });
  }
}
