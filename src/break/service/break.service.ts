import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { EModule } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { CreateBreakDto } from '../dto/break.dto';
import { Break } from '../schema/break.schema';

@Injectable()
export class BreakService extends CoreService<Break> {
  constructor(@InjectConnection() connection: Connection, @InjectModel(Break.name) model: Model<Break>) {
    super(connection, model);
  }

  async createBreak(dto: CreateBreakDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => this.create({ dto, session }),
      req,
      res,
      audit: { name: 'create-break', module: EModule.Break, payload: dto },
    });
  }
}
