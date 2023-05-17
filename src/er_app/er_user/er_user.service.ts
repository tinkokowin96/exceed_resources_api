import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { Bank } from 'src/bank/schema/bank.schema';
import { UserService } from 'src/common/service/user.service';
import { EModule, EUser } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { Permission } from 'src/permission/permission.schema';
import { CreateErUserDto } from './dto/create_er_user.dto';
import { ToggleActiveDto } from './dto/toggle_active.dto';
import { UpdatePermissionDto } from './dto/update_permission.dto';
import { ErUser } from './schema/er_user.schema';

@Injectable()
export class ErUserService extends UserService {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(ErUser.name) model: Model<ErUser>,
    @InjectModel(Permission.name) private readonly permissionModel: Model<Permission>,
    @InjectModel(Bank.name) private readonly bankModel: Model<Bank>,
  ) {
    super(connection, model);
  }

  async createAccount({ bankId, ...dto }: CreateErUserDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        let bank;
        if (bankId) bank = await this.findById({ id: bankId, custom: this.bankModel });
        return await this.create({
          dto: {
            ...dto,
            bank,
            type: EUser.ErApp,
          },
          session,
        });
      },
      req,
      res,
      audit: {
        name: 'er-user_create',
        module: EModule.ErApp,
        payload: dto,
      },
    });
  }

  async toggleActive({ id, active }: ToggleActiveDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => await this.findByIdAndUpdate({ id, update: { $set: { active } }, session }),
      res,
      req,
      audit: {
        name: 'er-user_toggle-active',
        module: EModule.ErApp,
        payload: { id, active },
      },
    });
  }

  async updatePermission({ userId, permissionId }: UpdatePermissionDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const permission = await this.findById({ id: permissionId, custom: this.permissionModel });
        const next = await this.findByIdAndUpdate({ id: userId, update: { $set: { permission } }, session });
        return next;
      },
      req,
      res,
      audit: {
        name: 'er-user_update-permission',
        module: EModule.ErApp,
        payload: { userId, permissionId },
      },
    });
  }
}
