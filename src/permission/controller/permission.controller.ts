import { Body, Controller, Patch, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { Users } from 'src/auth/user.decorator';
import { AppRequest } from 'src/common/util/type';
import { CreatePermissionDto } from '../dto/create_permission.dto';
import { UpdatePermissionDto } from '../dto/update_permission.dto';
import { PermissionService } from '../service/permission.service';

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
