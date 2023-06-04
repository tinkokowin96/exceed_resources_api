import { Body, Controller, Post, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ECategory } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './create_category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  // @Users([EUser.ErApp, EUser.Organization])
  @Post('create')
  async create(
    @Query('type') type: ECategory,
    @Body() dto: CreateCategoryDto,
    @Req() req: AppRequest,
    @Res() res: Response,
  ) {
    return this.service.createCategory(dto, type, req, res);
  }
}
