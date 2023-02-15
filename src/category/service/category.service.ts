import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { ECategory, EModule } from 'src/common/util/enumn';
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

  async createCategory(dto: CreateCategoryDto, type: ECategory, res: Response) {
    return this.makeTransaction({
      action: async () => {
        if (!type) throw new BadRequestException('Category type is required');
        return await this.create({ ...dto, type });
      },
      res,
      audit: {
        name: 'category_create',
        module: EModule.Category,
      },
    });
  }
}
