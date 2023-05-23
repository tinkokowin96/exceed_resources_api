import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { Users } from 'src/auth/user.decorator';
import { AppRequest } from 'src/common/util/type';
import {
  AddAssociatedOrganizationDto,
  CreateUserDto,
  GetUsersDto,
  LoginUserDto,
  ToggleErAppAccessDto,
} from './dto/user.dto';
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

  @Users(['ErApp'])
  @Post('toggle-erapp-access')
  async toggleErAppAccess(@Body() dto: ToggleErAppAccessDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.toggleErAppAccess(dto, req, res);
  }

  @Throttle(1, 120)
  @Users(['Organization', 'ErApp'])
  @Get('logout')
  async logout(@Req() req, @Res() res: Response) {
    return this.service.logoutUser(req, res);
  }

  @Users(['Any'])
  @Get('get-users')
  async getUser(@Param() dto: GetUsersDto, @Req() req, @Res() res: Response) {
    return this.service.getUsers(dto, req, res);
  }

  @Users(['Organization', 'ErApp'])
  @Get('add-associated-organization')
  async addAssociatedOrganization(
    @Body() dto: AddAssociatedOrganizationDto,
    @Req() req: AppRequest,
    @Res() res: Response,
  ) {
    return this.service.addAssociatedOrganization(dto, req, res);
  }
}
