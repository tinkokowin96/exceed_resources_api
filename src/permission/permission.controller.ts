import { Body, Controller, Patch, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { Users } from 'src/auth/user.decorator';
import { AppRequest } from 'src/common/util/type';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly service: PermissionService) {}

  @Throttle(2, 60)
  @Users(['ErApp', 'Organization'])
  @Post('create')
  async create(@Body() dto: CreatePermissionDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.createPermission(dto, req, res);
  }

  @Throttle(2, 60)
  @Users(['ErApp', 'Organization'])
  @Patch('update')
  async upate(@Body() dto: UpdatePermissionDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.updatePermission(dto, req, res);
  }
}
