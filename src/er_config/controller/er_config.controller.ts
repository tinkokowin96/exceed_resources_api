import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { Users } from 'src/auth/user.decorator';
import { AppRequest } from 'src/core/util/type';
import { CreateCurrencyDto } from '../dto/currency.dto';
import { EditErConfigDto } from '../dto/er_config.dto';
import { ErConfigService } from '../service/er_config.service';

@Controller('er-config')
export class ErConfigController {
  constructor(private readonly service: ErConfigService) {}

  @Users(['ErApp'])
  @Post('edit')
  async editErConfig(@Body() dto: EditErConfigDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.editConfig(dto, req, res);
  }

  @Users(['ErApp'])
  @Post('create-currency')
  async createCurrency(@Body() dto: CreateCurrencyDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.createCurrency(dto, req, res);
  }

  @Users(['ErApp'])
  @Post('edit-currency')
  async editCurrency(@Body() dto: EditErConfigDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.editConfig(dto, req, res);
  }

  @Users(['ErApp'])
  @Get('test')
  async test() {
    return 'Hello';
  }
}
