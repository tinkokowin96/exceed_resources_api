import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { ECategory, EModule, EUser } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { ErUser } from 'src/er_app/schema/er_user.schema';
import { OUser } from 'src/o_user/schema/o_user.schema';
import { CreateCategoryDto } from '../dto/create_category.dto';
import { Category } from '../schema/category.schema';

@Injectable()
export class CategoryService extends CoreService {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Category.name) model: Model<Category>,
  ) {
    super(connection, model);
  }

  async createCategory(dto: CreateCategoryDto, type: ECategory, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async () => {
        if (!type) throw new BadRequestException('Category type is required');
        return await this.create({ ...dto, type });
      },
      req,
      res,
      audit: {
        name: 'category_create',
        module: EModule.Category,
        submittedErUser: req.user?.type === EUser.ErApp ? (req.user as ErUser) : undefined,
        submittedOUser: req.user?.type === EUser.Organization ? (req.user as OUser) : undefined,
      },
    });
  }
}
