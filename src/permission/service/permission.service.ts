import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { intersection, pull } from 'lodash';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { EUser } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { ErUser } from 'src/er_app/schema/er_user.schema';
import { OUser } from 'src/o_user/schema/o_user.schema';
import { CreatePermissionDto } from '../dto/create_permission.dto';
import { Permission } from '../permission.schema';

@Injectable()
export class PermissionService extends CoreService {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Permission.name) model: Model<Permission>,
  ) {
    super(connection, model);
  }

  async createPermission(
    { assignableRoleIds: roles, ...dto }: CreatePermissionDto,
    { user, config }: AppRequest,
    res: Response,
  ) {
    return this.makeTransaction({
      action: async () => {
        const superAdmin =
          user.type === EUser.ErApp
            ? (user as ErUser).superAdmin
            : (user as OUser).currentOrganization.superAdmin;
        if (!superAdmin) {
          const includeRestricted = intersection(restrictedRoutes, dto.allowedRoutes);
          if (includeRestricted.length) throw new BadRequestException('Include restricted permissions');
        }

        const assignableRoles = (await this.find(
          {
            _id: { $in: roles },
            type: app === EApp.App ? ECategory.AUserRole : ECategory.CompanyUserRole,
          },
          this.categoryModel,
          { _id: 1 },
        )) as unknown as Category[];

        if (!superAdmin) {
          if (pull(roles, ...permission.assignableRoles.map((each) => each._id.toString())).length)
            throw new BadRequestException('Included forbidden assignable roles');
        }
        return await this.create({ ...dto, assignableRoles });
      },
      res,
      audit: {
        name: 'permission_create',
        app: app,
        payload: dto,
      },
    });
  }

  async updatePermission(
    { id, permissions: { add, remove } }: UpdatePermissionDto,
    app: EApp,
    { config: { restrictedRoutes } }: AppRequest,
    res: Response,
  ) {
    return this.makeTransaction({
      action: async () => {
        const includeRestricted = intersection(restrictedRoutes, [...add, ...remove]);
        if (includeRestricted.length) throw new BadRequestException('Include restricted permissions');
        await this.findByIdAndUpdate(id, {
          $push: { allowedRoutes: add },
          $pop: { allowedRoutes: remove },
        });
      },
      res,
      audit: {
        name: 'permission_update',
        app: app,
        payload: { add, remove },
      },
    });
  }
}
