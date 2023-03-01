import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { Users } from 'src/auth/user.decorator';
import { AppRequest } from 'src/common/util/type';
import { CreateOrganizationDto } from '../dto/create_organization.dto';
import { OrganizationService } from '../service/organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}

  @Users(['OAny'])
  @Throttle(1, 120)
  @Post('create')
  async createOrganization(@Body() dto: CreateOrganizationDto, @Req() req: AppRequest, @Res() res: Response) {
    return this.service.createOrganization(dto, req, res);
  }
}
