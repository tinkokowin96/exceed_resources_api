import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { EModule } from 'src/common/util/enumn';
import { AppRequest, ServiceTrigger } from 'src/common/util/type';
import { User } from 'src/user/schema/user.schema';
import { AddUserToDepartmentDto, CreateDepartmentDto } from './dto/department.dto';
import { Department } from './schema/department.schema';

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

  async addUser(dto: AddUserToDepartmentDto, req: AppRequest, res: Response, trigger?: ServiceTrigger) {
    return this.makeTransaction({
      action: async (ses) => {
        const session = trigger?.session ?? ses;
        const { departmentId, isHead, userId } = dto;
        const user = await this.findById({ id: userId, custom: this.userModel });
        const update = { $push: { colleagues: user } };
        if (isHead) update['$set'] = { head: user };
        return await this.findByIdAndUpdate({ id: departmentId, update, session });
      },
      req,
      res: trigger ? res : undefined,
      audit: {
        name: 'add-user',
        module: EModule.Department,
        triggerBy: trigger?.triggerBy ?? undefined,
        triggerType: trigger?.type ?? undefined,
        payload: dto,
      },
    });
  }
}
