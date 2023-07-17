import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/core/service/core.service';
import { ECategory, EModule } from 'src/core/util/enumn';
import { AppRequest } from 'src/core/util/type';
import { CreateCategoryDto } from './create_category.dto';
import { Category } from './category.schema';

@Injectable()
export class CategoryService extends CoreService<Category> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Category.name) model: Model<Category>,
  ) {
    super(connection, model);
  }

  async createCategory(dto: CreateCategoryDto, type: ECategory, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        if (!type) throw new BadRequestException('Category type is required');
        await this.create({ dto: { ...dto, type }, session });
      },
      req,
      res,
      audit: { name: 'create-category', module: EModule.Category },
    });
  }
}
