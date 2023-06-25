import { Injectable } from '@nestjs/common';
import { CoreService } from 'src/common/service/core.service';
import { AccumulatedLeave } from '../schema/accumulated_leave.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateAccumulatedLeaveDto } from '../dto/accumulated_leave.dto';
import { AppRequest, TriggeredBy } from 'src/common/util/type';
import { Response } from 'express';
import { EModule } from 'src/common/util/enumn';

@Injectable()
export class AccumulatedLeaveService extends CoreService<AccumulatedLeave> {
  constructor(
    @InjectModel(AccumulatedLeave.name) model: Model<AccumulatedLeave>,
    @InjectConnection() connection: Connection,
  ) {
    super(connection, model);
  }

  async createAccumulatedLeave(
    dto: CreateAccumulatedLeaveDto,
    req: AppRequest,
    res: Response,
    trigger?: TriggeredBy,
  ) {
    return this.makeTransaction({
      action: async (session) => {},
      req,
      res,
      audit: {
        name: 'create-accumulated-leave',
        module: EModule.Leave,
        payload: dto,
        triggeredBy: trigger.service,
      },
    });
  }
}
