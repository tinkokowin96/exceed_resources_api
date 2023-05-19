import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { intersection, pull } from 'lodash';
import { Connection, Model } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CoreService } from 'src/common/service/core.service';
import { ECategory, EModule } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { CreatePermissionDto } from './dto/create_permission.dto';
import { UpdatePermissionDto } from './dto/update_permission.dto';
import { Permission } from './permission.schema';

@Injectable()
export class PermissionService extends CoreService {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Permission.name) model: Model<Permission>,
    @InjectModel(Category.name) categoryModel: Model<Category>,
  ) {
    super(connection, model, categoryModel);
  }

  async createPermission({ assignableRoleIds, ...dto }: CreatePermissionDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const includeRestricted = intersection(req.config.restrictedRoutes, dto.allowedRoutes);
        if (includeRestricted.length) throw new BadRequestException('Include restricted permissions');

        const assignableRoles = (await this.find({
          filter: {
            _id: { $in: assignableRoleIds },
            type: ECategory.UserRole,
          },
          custom: this.categoryModel,
          projection: { _id: 1 },
        })) as unknown as Category[];

        if (!req.superAdmin) {
          if (!req.user.currentOrganization)
            throw new ForbiddenException("User don't have current associated organization");

          if (
            pull(
              assignableRoleIds,
              ...req.user.currentOrganization.permission.assignableRoles.map((each) => each.toString()),
            ).length
          )
            throw new BadRequestException('Included forbidden assignable roles');
        }

        return await this.create({ dto: { ...dto, assignableRoles }, session });
      },
      req,
      res,
      audit: {
        name: 'create-permission',
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
        await this.findByIdAndUpdate({
          id,
          update: {
            $push: { allowedRoutes: add },
            $pop: { allowedRoutes: remove },
          },
          session,
        });
      },
      res,
      req,
      audit: {
        name: 'update-permission',
        module: EModule.Permission,
        payload: { id, add, remove },
      },
    });
  }
}
