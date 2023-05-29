import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { EModule, EServiceTrigger } from 'src/common/util/enumn';
import { AppRequest, ServiceTrigger } from 'src/common/util/type';
import { PermissionService } from 'src/permission/permission.service';
import { CreatePositionDto, UpdatePositionDto } from './dto/position.dto';
import { Position } from './schema/position.schema';

@Injectable()
export class PositionService extends CoreService<Position> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Position.name) model: Model<Position>,
    private readonly permissionService: PermissionService,
  ) {
    super(connection, model);
  }

  async createPosition(dto: CreatePositionDto, req: AppRequest, res: Response, trigger?: ServiceTrigger) {
    return this.makeTransaction({
      action: async (session) => {
        const { permissionName, permissionDto, ...payload } = dto;

        const position = await this.create({ dto: payload, session });
        const permission = await this.permissionService.createPermission(
          {
            ...permissionDto,
            name: permissionName ?? `${payload.shortName} permission`,
            assignableRoleIds: [position.id],
          },
          req,
          res,
          { session, triggerBy: 'create-position', type: EServiceTrigger.Create },
        );
        const updated = await this.findByIdAndUpdate({
          id: position.id,
          session,
          update: { $set: { permission } },
        });
        return updated;
      },
      req,
      res: trigger ? undefined : res,
      audit: {
        name: 'create-position',
        module: EModule.Position,
        payload: dto,
        triggerBy: trigger?.triggerBy ?? undefined,
        triggerType: trigger?.type ?? undefined,
      },
    });
  }

  async updatePosition(dto: UpdatePositionDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const { id, ...update } = dto;
        return await this.findByIdAndUpdate({ id, update, session });
      },
      req,
      res,
      audit: { name: 'update-position', module: EModule.Position, payload: dto },
    });
  }
}
