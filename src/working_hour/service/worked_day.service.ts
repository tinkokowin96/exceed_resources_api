import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { Location } from 'src/common/schema/common.schema';
import { CoreService } from 'src/common/service/core.service';
import { getWeekDay } from 'src/common/util/date_time';
import { EModule } from 'src/common/util/enumn';
import { calculateDistance, getNestedIndex } from 'src/common/util/misc';
import { AppRequest } from 'src/common/util/type';
import { OConfig } from 'src/organization/schema/o_config.schema';
import { CustomWorkDay } from '../schema/custom_work_day.schema';
import { WorkedDay } from '../schema/worked_day.schema';
import objectSupport from 'dayjs/plugin/objectSupport';

@Injectable()
export class WorkedDayService extends CoreService<WorkedDay> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(WorkedDay.name) model: Model<WorkedDay>,
    @InjectModel(CustomWorkDay.name) private readonly customWorkDayModel: Model<CustomWorkDay>,
  ) {
    super(connection, model);
    dayjs.extend(objectSupport);
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
        const config =
          customWorkDay?.config ??
          (req.config as OConfig).workDays.find((each) => each.day === getWeekDay(new Date().getDay()))
            .config;

        if (!config.allowRemote) {
          const distance = calculateDistance(
            location,
            customWorkDay?.location ?? req.user.currentOrganization.branch.location,
          );
          if (distance > (req.config as OConfig).toleranceRangeInMeter)
            throw new BadRequestException('User is not within the range of office');
        }
        if (!config.flexibleWorkingHour) {
          const checkInTime = dayjs({ hour: config.checkInTime.hour, minute: config.checkInTime.minute });
          const dateDiff = dayjs().diff(checkInTime, 'minutes');
          if (dateDiff > 0) {
            const penalty = config.penalties[getNestedIndex(config.penalties, 'numMinute', dateDiff)].penalty;
            if (penalty) {
            }
          }
        }

        // return this.create({dto: , session})
        // if(customWorkDay?.location || req.user.currentOrganization.branch.)
      },
      req,
      res,
      audit: { name: 'check-in', module: EModule.WorkingHour, payload: location },
    });
  }
}