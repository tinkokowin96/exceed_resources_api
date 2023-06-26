import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { FindDto } from 'src/common/dto/find.dto';
import { CoreService } from 'src/common/service/core.service';
import { ECategory, EModule } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { CreateOrganizationDto } from '../dto/organization.dto';
import { OConfig } from '../schema/o_config.schema';
import { Organization } from '../schema/organization.schema';
import { BranchService } from 'src/branch/branch.service';

@Injectable()
export class OrganizationService extends CoreService<Organization> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Organization.name) model: Model<Organization>,
    @InjectModel(Category.name) categoryModel: Model<Category>,
    @InjectModel(OConfig.name) private readonly oConfigModel: Model<OConfig>,
    private readonly branchService: BranchService,
  ) {
    super(connection, model, categoryModel);
  }

  async createOrganization(dto: CreateOrganizationDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const { category, workingDays, overtimeForm, mainBranchName, address, location, remark, ...payload } =
          dto;

        if (req.user) throw new BadRequestException("Can't create other organization");
        const config = await this.create({
          dto: {
            workingDays,
            overtimeForm,
          },
          session,
          custom: this.oConfigModel,
        });

        const organization = await this.create({
          dto: {
            ...payload,
            config,
          },
          category: { ...category, type: ECategory.Organization },
          session,
        });

        await this.branchService.createBranch(
          { name: mainBranchName ?? 'main', organization, address, location, remark },
          req,
          res,
          {
            session,
            service: 'create-organization',
          },
        );

        return organization;
      },
      req,
      res,
      audit: {
        name: 'create-organization',
        module: EModule.User,
        payload: dto,
      },
    });
  }

  async getOrganizations(dto: FindDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async () => await this.find({ ...dto }),
      req,
      res,
      audit: { name: 'get-organizations', module: EModule.User },
    });
  }
}
