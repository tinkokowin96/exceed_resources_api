import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { Organization } from '../schema/organization.schema';

@Injectable()
export class OrganizationService extends CoreService {
  constructor(
    @InjectModel(Organization.name) model: Model<Organization>,
    @InjectConnection() connection: Connection,
  ) {
    super(connection, model);
  }

  //   async createOrganization(dto: , req: AppRequest, response: Response){}
}
