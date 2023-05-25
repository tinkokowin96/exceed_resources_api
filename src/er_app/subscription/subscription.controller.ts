import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Users } from 'src/auth/user.decorator';
import { EUser } from 'src/common/util/enumn';
import { RequestSubscriptionDto } from './dto/subscription_request.dto';
import { AppRequest } from 'src/common/util/type';
import { Response } from 'express';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}

  @Users([EUser.Any])
  @Post('request')
  async request(@Body() dto: RequestSubscriptionDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.requestSubscription(dto, req, res);
  }
}
