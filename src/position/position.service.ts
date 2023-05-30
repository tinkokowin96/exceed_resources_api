import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { intersection } from 'lodash';
import { ClientSession, Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { EModule } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { CreatePositionDto, UpdatePositionDto } from './dto/position.dto';
import { Position } from './schema/position.schema';

@Injectable()
export class PositionService extends CoreService<Position> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Position.name) model: Model<Position>,
  ) {
    super(connection, model);
  }

  async createPosition(dto: CreatePositionDto, req: AppRequest, res: Response, trigger?: ClientSession) {
    return this.makeTransaction({
      action: async (ses) => {
        const session = trigger ?? ses;
        if (req.user) {
          const includeRestricted = intersection(req.config.restrictedRoutes, dto.allowedRoutes);
          if (includeRestricted.length) throw new BadRequestException('Include restricted permissions');
        }
        return await this.create({ dto, session });
      },
      req,
      res: res,
      audit: trigger
        ? undefined
        : {
            name: 'create-position',
            module: EModule.Position,
            payload: dto,
          },
    });
  }

  async updatePosition(dto: UpdatePositionDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const { id, ...update } = dto;
        if (update.allowedRoutes) {
          const includeRestricted = intersection(req.config.restrictedRoutes, update.allowedRoutes);
          if (includeRestricted.length) throw new BadRequestException('Include restricted permissions');
        }
        return await this.findByIdAndUpdate({ id, update, session });
      },
      req,
      res,
      audit: { name: 'update-position', module: EModule.Position, payload: dto },
    });
  }
}
