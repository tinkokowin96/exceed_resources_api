import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CoreService } from 'src/common/service/core.service';
import { ECategory, EModule } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { CreateOrganizationDto } from '../dto/create_organization.dto';
import { Organization } from '../schema/organization.schema';
import { OConfig } from '../schema/o_config.schema';

@Injectable()
export class OrganizationService extends CoreService {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Organization.name) model: Model<Organization>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(OConfig.name) private readonly oConfigModel: Model<OConfig>,
  ) {
    super(connection, model);
  }

  async createOrganization(
    { category, categoryId, checkInTime, checkOutTime, ...dto }: CreateOrganizationDto,
    req: AppRequest,
    res: Response,
  ) {
    return this.makeTransaction({
      action: async () => {
        let cat;
        if (!category && !categoryId) throw new BadRequestException('Required organization category');
        if (categoryId) cat = await this.findById(categoryId, this.categoryModel);
        else
          cat = await (
            await this.create({ name: category, type: ECategory.Organization }, this.categoryModel)
          ).next;

        const config = await (
          await this.create(
            {
              checkInTime,
              checkOutTime,
            },
            this.oConfigModel,
          )
        ).next;
        return await this.create({ ...dto, superAdmin: req.user, category: cat, config });
      },
      req,
      res,
      audit: {
        name: 'o-user_create',
        module: EModule.OUser,
        payload: { category, categoryId, checkInTime, checkOutTime, ...dto },
      },
    });
  }
}