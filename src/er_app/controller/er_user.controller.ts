import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { Users } from 'src/auth/user.decorator';
import { LoginAccountDto } from 'src/common/dto/login_account.dto';
import { EModule } from 'src/common/util/enumn';
import { CreateErUserDto } from '../dto/create_er_user.dto';
import { ToggleActiveDto } from '../dto/toggle_active.dto';
import { UpdatePermissionDto } from '../dto/update_permission.dto';
import { ErUserService } from '../service/er_user.service';

@Controller('er-user')
export class ErUserController {
  constructor(private readonly service: ErUserService) {}

  @Throttle(1, 120)
  @Users(['ErApp'])
  @Post('create')
  async create(@Body() dto: CreateErUserDto, @Res() res: Response) {
    return this.service.createAccount(dto, res);
  }

  @Throttle(2, 60)
  @Post('login')
  async login(@Body() dto: LoginAccountDto, @Res() res: Response) {
    return this.service.login(dto, res, { name: 'er-user_login', module: EModule.ErApp, payload: dto });
  }

  @Throttle(1, 120)
  @Users(['ErApp'])
  @Get('logout')
  async logout(@Req() req, @Res() res: Response) {
    return this.service.logout(req, res, { name: 'er-user_logout', module: EModule.ErApp });
  }

  @Users(['ErApp'])
  @Post('toggle-active')
  async toggleActive(@Body() dto: ToggleActiveDto, @Res() res: Response) {
    return this.service.toggleActive(dto, res);
  }

  @Users(['ErApp'])
  @Post('update-permission')
  async updatePermission(@Body() dto: UpdatePermissionDto, @Res() res: Response) {
    return this.service.updatePermission(dto, res);
  }
}
