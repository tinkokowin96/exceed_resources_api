import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { ECategory, EModule } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { CreateCategoryDto } from './dto/create_category.dto';
import { Category } from './schema/category.schema';

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
      action: async (session) => {
        if (!type) throw new BadRequestException('Category type is required');
        await this.create({ dto: { ...dto, type }, session });
        // throw new BadRequestException('Exception Occured..');
      },
      req,
      res,
      audit: { name: 'create-category', module: EModule.Category },
    });
  }
}
