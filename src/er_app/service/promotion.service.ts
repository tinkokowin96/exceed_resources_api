import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { CreateCuponDto } from '../dto/create_cupon.dto';
import { Promotion } from '../schema/promotion.schema';

@Injectable()
export class PromotionService extends CoreService {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Promotion.name) model: Model<Promotion>,
  ) {
    super(connection, model);
  }

  async createPromotion({ category, categoryId }: CreateCuponDto);
}
