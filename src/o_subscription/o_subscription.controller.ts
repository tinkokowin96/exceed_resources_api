import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Users } from 'src/auth/user.decorator';
import { EUser } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { Response } from 'express';
import { OSubscriptionService } from './o_subscription.service';
import { CreateOSubscriptionDto } from './dto/o_subscription.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly service: OSubscriptionService) {}

  @Users([EUser.Any])
  @Post('request')
  async request(@Body() dto: CreateOSubscriptionDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.requestSubscription(dto, req, res);
  }
}
