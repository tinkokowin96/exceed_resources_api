import { Body, Controller, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Users } from 'src/auth/user.decorator';
import { ECategory, EUser } from 'src/common/util/enumn';
import { CreateCategoryDto } from '../dto/create_category.dto';
import { CategoryService } from '../service/category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Users([EUser.ErApp, EUser.OAdmin, EUser.Organization])
  @Post('create')
  async create(@Param('type') type: ECategory, @Body() dto: CreateCategoryDto, @Res() res: Response) {
    return this.service.createCategory(dto, type, res);
  }
}
