import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { Users } from 'src/auth/user.decorator';
import { AppRequest } from 'src/common/util/type';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('create')
  async create(@Body() dto: CreateUserDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.createUser(dto, req, res);
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.loginUser(dto, req, res);
  }

  @Throttle(1, 120)
  @Users(['Organization'])
  @Get('logout')
  async logout(@Req() req, @Res() res: Response) {
    return this.service.logoutUser(req, res);
  }
}
