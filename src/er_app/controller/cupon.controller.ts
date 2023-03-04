import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { Users } from 'src/auth/user.decorator';
import { AppRequest } from 'src/common/util/type';
import { CreateCuponDto } from '../dto/create_cupon.dto';
import { CuponService } from '../service/cupon.service';

@Controller('cupon')
export class CuponController {
  constructor(private readonly service: CuponService) {}

  @Post('create')
  @Users(['ErApp'])
  async create(@Body() dto: CreateCuponDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.createCupon(dto, req, res);
  }
}
