import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { WorkedDay } from '../schema/worked_day.schema';
import { CustomWorkDay } from '../schema/custom_working_day.schema';
import { AppRequest } from 'src/common/util/type';
import { Response } from 'express';
import { EModule } from 'src/common/util/enumn';

@Injectable()
export class WorkedDayService extends CoreService<WorkedDay> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(WorkedDay.name) model: Model<WorkedDay>,
    @InjectModel(CustomWorkDay.name) private readonly customWorkDayModel: Model<CustomWorkDay>,
  ) {
    super(connection, model);
  }

  async checkIn(location: Location, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const customWorkDay = await this.findOne({
          filter: {
            $and: [
              { startDate: { $gte: new Date() } },
              { endDate: { $lte: new Date() } },
              {
                $or: [
                  { acceptedUsers: { $elemMatch: req.user._id } },
                  { affectedPositions: { $elemMatch: req.user.currentOrganization.position } },
                ],
              },
            ],
          },
          custom: this.customWorkDayModel,
        });
      },
      req,
      res,
      audit: { name: 'check-in', module: EModule.WorkingHour, payload: location },
    });
  }
}
