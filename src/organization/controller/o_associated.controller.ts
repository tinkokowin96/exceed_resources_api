import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { OAssociatedService } from '../service/o_associated.service';
import { CreateOAssociatedDto } from '../dto/o_associated.dto';
import { AppRequest } from 'src/common/util/type';
import { Response } from 'express';

@Controller('o-associated')
export class OAssociatedController {
  constructor(private readonly service: OAssociatedService) {}

  @Post('create')
  async create(@Body() dto: CreateOAssociatedDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.createOAssociated(dto, req, res);
  }
}
