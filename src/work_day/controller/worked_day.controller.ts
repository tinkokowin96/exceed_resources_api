import { Body, Controller, Patch, Post, Req, Res } from '@nestjs/common';
import { WorkedDayService } from '../service/worked_day.service';
import { Users } from 'src/auth/user.decorator';
import { Location } from 'src/core/schema/common.schema';
import { Response } from 'express';
import { AppRequest } from 'src/core/util/type';

@Controller('worked-day')
export class WorkedDayController {
  constructor(private readonly service: WorkedDayService) {}

  @Users(['Organization'])
  @Post('check-in')
  async checkIn(@Body('location') location: Location, @Req() req: AppRequest, @Res() res: Response) {}

  @Users(['Organization'])
  @Patch('check-out')
  async checkOut(@Body('location') location: Location, @Req() req: AppRequest, @Res() res: Response) {}

  @Users(['Organization'])
  @Patch('start-break')
  async startBreak(@Body('location') location: Location, @Req() req: AppRequest, @Res() res: Response) {}

  @Users(['Organization'])
  @Patch('finish-break')
  async finishBreak(@Body('location') location: Location, @Req() req: AppRequest, @Res() res: Response) {}

  @Users(['Organization'])
  @Patch('start-user-break')
  async startCustomBreak(
    @Body('location') location: Location,
    @Req() req: AppRequest,
    @Res() res: Response,
  ) {}

  @Users(['Organization'])
  @Patch('finish-user-break')
  async finishCustomBreak(
    @Body('location') location: Location,
    @Req() req: AppRequest,
    @Res() res: Response,
  ) {}

  @Users(['Organization'])
  @Patch('late-approve')
  async lateApprove(@Body('location') location: Location, @Req() req: AppRequest, @Res() res: Response) {}
}
