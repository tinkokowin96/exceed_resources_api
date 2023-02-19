import { Body, Controller, Post, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { Users } from 'src/auth/user.decorator';
import { ECategory, EUser } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { CreateCategoryDto } from '../dto/create_category.dto';
import { CategoryService } from '../service/category.service';

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
