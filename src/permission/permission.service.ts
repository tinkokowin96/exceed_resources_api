import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { intersection, pull } from 'lodash';
import { Connection, Model } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CoreService } from 'src/common/service/core.service';
import { ECategory, EModule } from 'src/common/util/enumn';
import { AppRequest, ServiceTrigger, Type } from 'src/common/util/type';
import { Permission } from './permission.schema';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';

@Injectable()
export class PermissionService extends CoreService<Permission> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Permission.name) model: Model<Permission>,
    @InjectModel(Category.name) categoryModel: Model<Type<Category, Permission>>,
  ) {
    super(connection, model, categoryModel);
  }

  async createPermission(dto: CreatePermissionDto, req: AppRequest, res: Response, trigger?: ServiceTrigger) {
    return this.makeTransaction({
      action: async (session) => {
        const { assignableRoleIds, ...payload } = dto;
        const includeRestricted = intersection(req.config.restrictedRoutes, payload.allowedRoutes);
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
            pull(assignableRoleIds, ...req.permission.assignableRoles.map((each) => each.toString())).length
          )
            throw new BadRequestException('Included forbidden assignable roles');
        }

        return await this.create({ dto: { ...payload, assignableRoles }, session });
      },
      req,
      res: trigger ? undefined : res,
      audit: {
        name: 'create-permission',
        module: EModule.Permission,
        payload: dto,
        triggerBy: trigger?.triggerBy ?? undefined,
        triggerType: trigger?.type ?? undefined,
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
