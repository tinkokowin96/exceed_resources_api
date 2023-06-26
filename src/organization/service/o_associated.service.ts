import { BadRequestException, Injectable } from '@nestjs/common';
import { CoreService } from 'src/common/service/core.service';
import { OAssociated } from '../schema/o_associated.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateOAssociatedDto } from '../dto/o_associated.dto';
import { AppRequest, TriggeredBy } from 'src/common/util/type';
import { Response } from 'express';
import { EModule } from 'src/common/util/enumn';
import { Branch } from 'src/branch/branch.schema';
import { Position } from 'src/position/position.schema';
import { Department } from 'src/department/department.schema';

@Injectable()
export class OAssociatedService extends CoreService<OAssociated> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(OAssociated.name) model: Model<OAssociated>,
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
    @InjectModel(Position.name) private readonly positionModel: Model<Position>,
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
  ) {
    super(connection, model);
  }

  async createOAssociated(dto: CreateOAssociatedDto, req: AppRequest, res: Response, trigger: TriggeredBy) {
    return this.makeTransaction({
      action: async (ses) => {
        const session = trigger?.session ?? ses;
        const { userBranch, branchId, userPosition, positionId, userDepartments, departmentIds, ...payload } =
        dto;
        let branch = userBranch
        let position = userPosition
        let departments = userDepartments
        if (!userBranch && !branchId) throw new BadRequestException('Branch is required');
        if (!userPosition && !positionId) throw new BadRequestException('Position is required');
        if(branchId) 
      },
      req,
      res,
      audit: {
        name: 'create-oassociated',
        module: EModule.User,
        payload: dto,
        triggeredBy: trigger?.service,
      },
    });
  }
}
