import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { Users } from 'src/auth/user.decorator';
import { EModule } from 'src/common/util/enumn';
import { CreateOUserDto } from '../dto/create_o_user.dto';
import { LoginOUserDto } from '../dto/login_o_user.dto';
import { OUserService } from '../service/o_user.service';

@Controller('o-user')
export class OUserController {
  constructor(private readonly service: OUserService) {}

  @Throttle(1, 120)
  @Post('create')
  async createAccount(@Body() dto: CreateOUserDto, @Res() res: Response) {
    return this.service.createAccount(dto, res);
  }

  @Throttle(2, 60)
  @Post('login')
  async loginAccount(@Body() dto: LoginOUserDto, @Res() res: Response) {
    return this.service.login(dto, res, { name: 'o-user_login', module: EModule.OUser, payload: dto });
  }

  @Throttle(1, 120)
  @Users(['Organization'])
  @Get('logout')
  async logout(@Req() req, @Res() res: Response) {
    return this.service.logout(req, res, { name: 'o-user_logout', module: EModule.OUser });
  }
}
