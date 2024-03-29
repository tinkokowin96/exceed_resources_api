import { Body, Controller, Patch, Post, Req, Res } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Users } from 'src/auth/user.decorator';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from 'src/subscription/subscription.dto';
import { AppRequest } from 'src/core/util/type';
import { Response } from 'express';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}

  @Users(['ErApp'])
  @Post('create')
  async create(@Body() dto: CreateSubscriptionDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.createSubscription(dto, req, res);
  }

  @Users(['ErApp'])
  @Patch('update')
  async update(@Body() dto: UpdateSubscriptionDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.updateSubscription(dto, req, res);
  }
}
