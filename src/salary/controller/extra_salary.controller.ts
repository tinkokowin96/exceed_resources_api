import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ExtraSalaryService } from '../service/extra_salary.service';
import { Users } from 'src/auth/user.decorator';
import { ApproveExtraSalaryDto, CreateExtraSalaryDto } from '../dto/extra_salary.dto';
import { AppRequest } from 'src/core/util/type';
import { Response } from 'express';

@Controller('extra-salary')
export class ExtraSalaryController {
  constructor(private readonly service: ExtraSalaryService) {}
  @Users(['Organization'])
  @Post('create')
  async create(@Body() dto: CreateExtraSalaryDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.createExtraSalary(dto, req, res);
  }

  @Users(['Organization'])
  @Post('approve')
  async approve(@Body() dto: ApproveExtraSalaryDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.approveExtraSalary(dto, req, res);
  }
}
