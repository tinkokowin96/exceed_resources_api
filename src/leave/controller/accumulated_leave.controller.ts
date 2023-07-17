import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { Users } from 'src/auth/user.decorator';
import { AppRequest } from 'src/core/util/type';
import { CreateAccumulatedLeaveDto } from '../dto/accumulated_leave.dto';
import { AccumulatedLeaveService } from '../service/accumulated_leave.service';

@Controller('accumulated-leave')
export class AccumulatedLeaveController {
  constructor(private readonly service: AccumulatedLeaveService) {}

  @Users(['Organization'])
  @Post('create')
  async create(@Body() dto: CreateAccumulatedLeaveDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.createAccumulatedLeave(dto, req, res);
  }
}
