import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { ECategory, EModule } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { CreateCuponDto } from '../dto/create_cupon.dto';
import { Cupon } from '../schema/cupon.schema';

@Injectable()
export class CuponService extends CoreService {
  constructor(@InjectConnection() connection: Connection, @InjectModel(Cupon.name) model: Model<Cupon>) {
    super(connection, model);
  }

  async createCupon({ category, ...dto }: CreateCuponDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) =>
        await this.create({
          dto: { ...dto, category: { ...category, type: ECategory.Cupon } },
          session,
        }),
      req,
      res,
      audit: { name: 'cupon_create', module: EModule.ErApp, payload: { category, ...dto } },
    });
  }
}
