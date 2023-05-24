import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { PositionService } from './position.service';
import { Users } from 'src/auth/user.decorator';

import { AppRequest } from 'src/common/util/type';
import { Response } from 'express';
import { CreatePositionDto } from './dto/position.dto';

@Controller('position')
export class PositionController {
  constructor(private readonly service: PositionService) {}

  @Users(['Organization'])
  @Post('create')
  async createPosition(@Body() dto: CreatePositionDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.createPosition(dto, req, res);
  }
}
