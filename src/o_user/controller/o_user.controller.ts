import { Body, Controller, Post, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { Users } from 'src/auth/user.decorator';
import { CreateOUserDto } from '../dto/create_o_user.dto';
import { LoginOUserDto } from '../dto/login_o_user.dto';
import { OUserService } from '../service/o_user.service';

@Controller('o-user')
export class OUserController {
  constructor(private readonly service: OUserService) {}

  @Users(['Organization'])
  @Throttle(1, 120)
  @Post('create')
  async createAccount(@Body() dto: CreateOUserDto, @Res() res: Response) {
    return this.service.createAccount(dto, res);
  }

  @Users(['Organization'])
  @Throttle(2, 60)
  @Post('login')
  async loginAccount(@Body() dto: LoginOUserDto, @Res() res: Response) {
    return this.service.loginAccount(dto, res);
  }
}
