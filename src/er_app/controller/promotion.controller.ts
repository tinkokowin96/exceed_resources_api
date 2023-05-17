import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { Users } from 'src/auth/user.decorator';
import { AppRequest } from 'src/common/util/type';
import { Promotion } from '../schema/promotion.schema';
import { PromotionService } from '../service/promotion.service';

@Controller('er-app/promotion')
export class PromotionController {
  constructor(private readonly service: PromotionService) {}

  @Post('create')
  @Users(['ErApp'])
  async create(@Body() dto: Promotion, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.createPromotion(dto, req, res);
  }
}
