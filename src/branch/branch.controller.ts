import { Body, Controller, Post } from '@nestjs/common';
import { Response } from 'express';
import { Users } from 'src/auth/user.decorator';
import { AppRequest } from 'src/core/util/type';
import { CreateBranchDto } from './branch.dto';
import { BranchService } from './branch.service';

@Controller('branch')
export class BranchController {
  constructor(private readonly service: BranchService) {}

  @Users(['Organization'])
  @Post('create')
  async createBranch(@Body() dto: CreateBranchDto, req: AppRequest, res: Response) {
    return this.service.createBranch(dto, req, res);
  }
}
