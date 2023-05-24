import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { Department } from './schema/department.schema';
import { AppRequest } from 'src/common/util/type';
import { CreateDepartmentDto } from './dto/department.dto';
import { EModule } from 'src/common/util/enumn';
import { Response } from 'express';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class DepartmentService extends CoreService {
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
          departments = await this.find({ filter: { _id: { $in: childDepartmentIds } } });
        return this.create({ dto: { ...payload, head, departments }, session });
      },
      req,
      res,
      audit: { name: 'create-department', module: EModule.Department, payload: dto },
    });
  }
}
