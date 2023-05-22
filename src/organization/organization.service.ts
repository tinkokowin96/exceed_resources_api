import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CoreService } from 'src/common/service/core.service';
import { ECategory, EModule } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { CreateOrganizationDto } from './dto/create_organization.dto';
import { OConfig } from './schema/o_config.schema';
import { Organization } from './schema/organization.schema';

@Injectable()
export class OrganizationService extends CoreService {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Organization.name) model: Model<Organization>,
    @InjectModel(Category.name) categoryModel: Model<Category>,
    @InjectModel(OConfig.name) private readonly oConfigModel: Model<OConfig>,
  ) {
    super(connection, model, categoryModel);
  }

  async createOrganization(dto: CreateOrganizationDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const { category, checkInTime, checkOutTime, ...rest } = dto;
        const config = await (
          await this.create({
            dto: {
              checkInTime,
              checkOutTime,
              superAdmin: req.user,
            },
            session,
            custom: this.oConfigModel,
          })
        ).next;

        const organization = await (
          await this.create({
            dto: {
              ...rest,
              config,
              category: { ...category, type: ECategory.Organization },
            },
            session,
          })
        ).next;

        return { next: organization };
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
}
