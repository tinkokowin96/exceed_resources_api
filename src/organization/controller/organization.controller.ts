import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { Users } from 'src/auth/user.decorator';
import { AppRequest } from 'src/core/util/type';
import { CreateOrganizationDto } from '../dto/organization.dto';
import { OrganizationService } from '../service/organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}

  @Throttle(1, 120)
  @Post('create')
  async createOrganization(@Body() dto: CreateOrganizationDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.createOrganization(dto, req, res);
  }

  @Users(['ErApp'])
  @Post('getOrganizations')
  async getOrganizations(@Body() dto: CreateOrganizationDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.createOrganization(dto, req, res);
  }
}
