import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { AppRequest } from 'src/common/util/type';
import { EModule } from 'src/common/util/enumn';
import { Position } from './schema/position.schema';
import { CreatePositionDto } from './dto/position.dto';
import { Response } from 'express';
import { Permission } from 'src/permission/permission.schema';

@Injectable()
export class PositionService extends CoreService<Position> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Position.name) model: Model<Position>,
    @InjectModel(Permission.name) private readonly permissionModel: Model<Permission>,
  ) {
    super(connection, model);
  }

  async createPosition(dto: CreatePositionDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const { permissionId, ...payload } = dto;
        const permission = await this.findById({ id: permissionId, custom: this.permissionModel });
        return this.create({ dto: { ...payload, permission }, session });
      },
      req,
      res,
      audit: { name: 'create-position', module: EModule.Position, payload: dto },
    });
  }
}
