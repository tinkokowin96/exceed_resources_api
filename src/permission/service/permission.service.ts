import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { intersection, pull } from 'lodash';
import { Connection, Model } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CoreService } from 'src/common/service/core.service';
import { ECategory, EModule, EUser } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { ErUser } from 'src/er_app/schema/er_user.schema';
import { OUser } from 'src/o_user/schema/o_user.schema';
import { CreatePermissionDto } from '../dto/create_permission.dto';
import { UpdatePermissionDto } from '../dto/update_permission.dto';
import { Permission } from '../permission.schema';

@Injectable()
export class PermissionService extends CoreService {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Permission.name) model: Model<Permission>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {
    super(connection, model);
  }

  async createPermission({ assignableRoleIds, ...dto }: CreatePermissionDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const superAdmin =
          req.user.type === EUser.ErApp
            ? (req.user as ErUser).superAdmin
            : (req.user as OUser).currentOrganization.superAdmin;

        const includeRestricted = intersection(req.config.restrictedRoutes, dto.allowedRoutes);
        if (includeRestricted.length) throw new BadRequestException('Include restricted permissions');

        const assignableRoles = (await this.find(
          {
            _id: { $in: assignableRoleIds },
            type: req.user.type === EUser.ErApp ? ECategory.ErUserRole : ECategory.OUserRole,
          },
          this.categoryModel,
          { _id: 1 },
        )) as unknown as Category[];

        if (!superAdmin) {
          const permission =
            req.user.type === EUser.ErApp
              ? (req.user as ErUser).permission
              : (req.user as OUser).currentOrganization.permission;

          if (pull(assignableRoleIds, ...permission.assignableRoles.map((each) => each.toString())).length)
            throw new BadRequestException('Included forbidden assignable roles');
        }

        return await this.create({ ...dto, assignableRoles }, session);
      },
      req,
      res,
      audit: {
        name: 'permission_create',
        module: EModule.Permission,
        payload: { assignableRoleIds, ...dto },
      },
    });
  }

  async updatePermission(
    { id, permissions: { add, remove } }: UpdatePermissionDto,
    req: AppRequest,
    res: Response,
  ) {
    return this.makeTransaction({
      action: async (session) => {
        const includeRestricted = intersection(req.config.restrictedRoutes, [...add, ...remove]);
        if (includeRestricted.length) throw new BadRequestException('Include restricted permissions');
        await this.findByIdAndUpdate(
          id,
          {
            $push: { allowedRoutes: add },
            $pop: { allowedRoutes: remove },
          },
          session,
        );
      },
      res,
      req,
      audit: {
        name: 'permission_update',
        module: EModule.Permission,
        payload: { id, add, remove },
      },
    });
  }
}
