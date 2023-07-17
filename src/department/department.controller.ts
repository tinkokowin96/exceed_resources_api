import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Users } from 'src/auth/user.decorator';
import { CreateDepartmentDto } from './department.dto';
import { AppRequest } from 'src/core/util/type';
import { Response } from 'express';

@Controller('department')
export class DepartmentController {
  constructor(private readonly service: DepartmentService) {}

  @Users(['Organization'])
  @Post('create')
  async createDepartment(@Body() dto: CreateDepartmentDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.createDepartment(dto, req, res);
  }
}
