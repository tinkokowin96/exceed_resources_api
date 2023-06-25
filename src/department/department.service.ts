import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { EModule } from 'src/common/util/enumn';
import { AppRequest, TriggeredBy } from 'src/common/util/type';
import { User } from 'src/user/schema/user.schema';
import { ChangeDepartmentHeadDto, CreateDepartmentDto } from './department.dto';
import { Department } from './department.schema';

@Injectable()
export class DepartmentService extends CoreService<Department> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Department.name) model: Model<Department>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    super(connection, model);
  }

  async createDepartment(dto: CreateDepartmentDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const { headId, childDepartmentIds, ...payload } = dto;
        let departments;
        const head = await this.findById({ id: headId, custom: this.userModel });
        if (childDepartmentIds)
          departments = (await this.find({ filter: { _id: { $in: childDepartmentIds } } })).items;
        return this.create({ dto: { ...payload, head, departments }, session });
      },
      req,
      res,
      audit: { name: 'create-department', module: EModule.Department, payload: dto },
    });
  }

  async changeDepartmentHead(
    dto: ChangeDepartmentHeadDto,
    req: AppRequest,
    res: Response,
    trigger?: TriggeredBy,
  ) {
    return this.makeTransaction({
      action: async (ses) => {
        const session = trigger?.session ?? ses;
        const { departmentId, userId } = dto;
        const user = await this.findById({ id: userId, custom: this.userModel });
        return await this.findByIdAndUpdate({ id: departmentId, update: { $set: { head: user } }, session });
      },
      req,
      res: trigger ? undefined : res,
      audit: {
        name: 'change-department-head',
        module: EModule.Department,
        payload: dto,
        triggeredBy: trigger?.service,
      },
    });
  }
}
