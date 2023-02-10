import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { ErUserBank } from 'src/bank/schema/er_user_bank';
import { LoginAccountDto } from 'src/common/dto/login_account.dto';
import { UserService } from 'src/common/service/user.service';
import { EModule, EUser } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { Permission } from 'src/permission/permission.schema';
import { CreateErUserDto } from '../dto/create_er_user.dto';
import { ToggleActiveDto } from '../dto/toggle_active.dto';
import { UpdatePermissionDto } from '../dto/update_permission.dto';
import { ErUser } from '../schema/er_user.schema';

@Injectable()
export class ErUserService extends UserService<ErUser> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(ErUser.name) model: Model<ErUser>,
    @InjectModel(Permission.name) private readonly permissionModel: Model<Permission>,
    @InjectModel(ErUserBank.name) private readonly erUserBankModel: Model<ErUserBank>,
  ) {
    super(connection, model);
  }

  async createAccount({ bankId, ...dto }: CreateErUserDto, res: Response) {
    return this.makeTransaction({
      action: async () => {
        let bank;
        if (bankId) bank = await this.findById(bankId, this.erUserBankModel);
        return await this.create({
          ...dto,
          bank,
          type: EUser.ErApp,
        });
      },
      res,
      audit: {
        name: 'er-user_create',
        module: EModule.ErApp,
        payload: dto,
      },
    });
  }

  async loginAccount(dto: LoginAccountDto, res: Response) {
    return this.makeTransaction({
      action: async () =>
        await this.login({
          dto,
          res,
          callback: async (user: ErUser) => {
            if (!user.active) throw new ForbiddenException('User is not active');
            return {
              superAdmin: user.superAdmin,
              type: EUser.ErApp,
              permissionId: user.permission?._id,
            };
          },
        }),
      res,
      audit: {
        name: 'er-user_login',
        module: EModule.ErApp,
        payload: dto,
      },
    });
  }

  async logoutAccount({ id }: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async () => await this.logout(id, res),
      res,
      audit: {
        name: 'er-user_logout',
        module: EModule.ErApp,
      },
    });
  }

  async toggleActive({ id, active }: ToggleActiveDto, res: Response) {
    return this.makeTransaction({
      action: async () => await this.findByIdAndUpdate(id, { $set: { active } }),
      res,
      audit: {
        name: 'er-user_toggle-active',
        module: EModule.ErApp,
        payload: { id, active },
      },
    });
  }

  async updatePermission({ userId, permissionId }: UpdatePermissionDto, res: Response) {
    return this.makeTransaction({
      action: async () => {
        const permission = await this.findById(permissionId, this.permissionModel);
        const next = await this.findByIdAndUpdate(userId, { $set: { permission } });
        return next;
      },
      res,
      audit: {
        name: 'er-user_update-permission',
        module: EModule.ErApp,
        payload: { userId, permissionId },
      },
    });
  }
}
