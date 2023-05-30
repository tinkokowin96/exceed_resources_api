import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { PositionService } from './position.service';
import { Users } from 'src/auth/user.decorator';

import { AppRequest } from 'src/common/util/type';
import { Response } from 'express';
import { CreatePositionDto, UpdatePositionDto } from './dto/position.dto';

@Controller('position')
export class PositionController {
  constructor(private readonly service: PositionService) {}

  @Users(['Organization'])
  @Post('create')
  async createPosition(@Body() dto: CreatePositionDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.createPosition(dto, req, res);
  }

  @Users(['Organization'])
  @Post('update')
  async updatePosition(
    @Body() dto: Omit<UpdatePositionDto, 'basicSalary'>,
    @Req() req: AppRequest,
    @Res() res: Response,
  ) {
    return this.service.updatePosition(dto, req, res);
  }

  @Users(['Organization'])
  @Post('update-salary')
  async updateSalary(
    @Body() dto: Pick<UpdatePositionDto, 'basicSalary' | 'id'>,
    @Req() req: AppRequest,
    @Res() res: Response,
  ) {
    return this.service.updatePosition(dto, req, res);
  }

  @Users(['Organization'])
  @Post('update-permission')
  async updatePermission(
    @Body() dto: Pick<UpdatePositionDto, 'allowedRoutes' | 'id'>,
    @Req() req: AppRequest,
    @Res() res: Response,
  ) {
    return this.service.updatePosition(dto, req, res);
  }
}
