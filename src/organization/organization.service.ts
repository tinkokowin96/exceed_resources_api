import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CoreService } from 'src/common/service/core.service';
import { ECategory, EModule } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { User } from 'src/user/schema/user.schema';
import { CreateOrganizationDto } from './dto/create_organization.dto';
import { Organization } from './schema/organization.schema';
import { OAssociated } from './schema/o_associated.schema';
import { OConfig } from './schema/o_config.schema';

@Injectable()
export class OrganizationService extends CoreService {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Organization.name) model: Model<Organization>,
    @InjectModel(Category.name) categoryModel: Model<Category>,
    @InjectModel(OConfig.name) private readonly oConfigModel: Model<OConfig>,
    @InjectModel(OAssociated.name) private readonly oAssociatedModel: Model<OAssociated>,
    @InjectModel(User.name) private readonly oUserModel: Model<User>,
  ) {
    super(connection, model, categoryModel);
  }

  async createOrganization(
    { category, checkInTime, checkOutTime, ...dto }: CreateOrganizationDto,
    req: AppRequest,
    res: Response,
  ) {
    return this.makeTransaction({
      action: async (session) => {
        const config = await (
          await this.create({
            dto: {
              checkInTime,
              checkOutTime,
            },
            session,
            custom: this.oConfigModel,
          })
        ).next;

        const organization = await (
          await this.create({
            dto: {
              ...dto,
              superAdmin: req.user,
              config,
              category: { ...category, type: ECategory.Organization },
            },
            session,
          })
        ).next;

        const currentOrganization = await (
          await this.create({
            dto: {
              superAdmin: true,
              checkInTime,
              checkOutTime,
              organization,
            },
            session,
            custom: this.oAssociatedModel,
          })
        ).next;
        await this.findByIdAndUpdate({
          id: req.id,
          update: { $set: { currentOrganization } },
          session,
          custom: this.oUserModel,
        });
        return { next: organization };
      },
      req,
      res,
      audit: {
        name: 'create-organization',
        module: EModule.User,
        payload: { category, checkInTime, checkOutTime, ...dto },
      },
    });
  }
}
