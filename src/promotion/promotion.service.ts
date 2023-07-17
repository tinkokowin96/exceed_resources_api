import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/core/service/core.service';
import { EModule } from 'src/core/util/enumn';
import { AppRequest } from 'src/core/util/type';
import { Promotion } from './promotion.schema';

@Injectable()
export class PromotionService extends CoreService<Promotion> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Promotion.name) model: Model<Promotion>,
  ) {
    super(connection, model);
  }

  async createPromotion(dto: Promotion, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        if (dto.active_until && new Date(dto.active_until).getTime() <= Date.now())
          throw new BadRequestException('End date must be in the future');
        return this.create({ dto, session });
      },
      req,
      res,
      audit: { name: 'create-promotion', module: EModule.ErApp, payload: dto },
    });
  }
}
