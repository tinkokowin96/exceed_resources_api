import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Users } from 'src/auth/user.decorator';
import { EUser } from 'src/core/util/enumn';
import { AppRequest } from 'src/core/util/type';
import { Response } from 'express';
import { OSubscriptionService } from './o_subscription.service';
import { CalculatePriceDto, CreateOSubscriptionDto } from './o_subscription.dto';

@Controller('o-subscription')
export class OSubscriptionController {
  constructor(private readonly service: OSubscriptionService) {}

  @Users([EUser.Any])
  @Get('calculate-price')
  async calculatePrice(@Param() dto: CalculatePriceDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.calculateSubscriptionPrice(dto, req, res);
  }

  @Users([EUser.Any])
  @Post('request')
  async request(@Body() dto: CreateOSubscriptionDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.requestSubscription(dto, req, res);
  }
}
