import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { BreakService } from '../service/break.service';
import { Users } from 'src/auth/user.decorator';
import { CreateBreakDto } from '../dto/break.dto';
import { AppRequest } from 'src/common/util/type';
import { Response } from 'express';

@Controller('break')
export class BreakController {
  constructor(private readonly service: BreakService) {}

  @Users(['Organization'])
  @Post('create')
  async createBreak(@Body() dto: CreateBreakDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.createBreak(dto, req, res);
  }
}
