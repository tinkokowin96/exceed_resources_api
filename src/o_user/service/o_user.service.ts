import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { Bank } from 'src/bank/schema/bank.schema';
import { UserService } from 'src/common/service/user.service';
import { EModule, EUser } from 'src/common/util/enumn';
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

  async createOwner(dto: CreateOwnerDto, res: Response) {
    return this.makeTransaction({
      action: async () => {
        return await this.create({
          ...dto,
          joiningDate: new Date(),
          type: EUser.Organization,
        });
      },
      res,
      audit: {
        name: 'o-user_create-owner',
        module: EModule.OUser,
        payload: dto,
      },
    });
  }

  async createEmployee(
    { bankId, currentOrganizationId, projectIds, associatedOrganizationIds, ...dto }: CreateEmployeeDto,
    res: Response,
  ) {
    return this.makeTransaction({
      action: async () => {
        let bank, currentOrganization, projects, associatedOrganizations;
        if (bankId) bank = await this.findById(bankId, this.bankModel, { _id: bankId });
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
          type: EUser.Organization,
          bank,
          currentOrganization,
          projects,
          associatedOrganizations,
        });
      },
      res,
      audit: {
        name: 'o-user_create-employee',
        module: EModule.OUser,
        payload: dto,
      },
    });
  }
}
