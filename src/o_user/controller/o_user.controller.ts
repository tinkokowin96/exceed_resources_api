import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { Users } from 'src/auth/user.decorator';
import { EModule } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { CreateEmployeeDto, CreateOwnerDto } from '../dto/create_o_user.dto';
import { LoginOUserDto } from '../dto/login_o_user.dto';
import { OUserService } from '../service/o_user.service';

@Controller('o-user')
export class OUserController {
  constructor(private readonly service: OUserService) {}

  @Users(['Organization'])
  @Post('create-owner')
  async createOwner(@Body() dto: CreateOwnerDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.createOwner(dto, req, res);
  }

  @Users(['Organization'])
  @Post('create-employee')
  async createEmployee(@Body() dto: CreateEmployeeDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.createEmployee(dto, req, res);
  }

  @Post('login')
  async loginAccount(@Body() dto: LoginOUserDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.login(dto, req, res, {
      name: 'o-user_login',
      module: EModule.OUser,
      payload: dto,
    });
  }

  @Throttle(1, 120)
  @Users(['Organization'])
  @Get('logout')
  async logout(@Req() req, @Res() res: Response) {
    return this.service.logout(req, res, {
      name: 'o-user_logout',
      module: EModule.OUser,
    });
  }
}
