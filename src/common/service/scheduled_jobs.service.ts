import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { ExtraSalary } from 'src/extra_salary/extra_salary.schema';
import { EExtraSalaryStatus } from '../util/enumn';
import { User } from 'src/user/schema/user.schema';
import { CoreService } from './core.service';

@Injectable()
export class ScheduledJobService extends CoreService<User> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(User.name) model: Model<User>,
    @InjectModel(ExtraSalary.name) private readonly extraSalaryModel: Model<ExtraSalary>,
  ) {
    super(connection, model);
  }

  async approveExtraSalary() {
    const filter = { $and: [{ createdAt: new Date(), status: EExtraSalaryStatus.Pending }] };
    const extras = await this.extraSalaryModel.find(filter, null, {
      populate: [{ path: 'User', select: '_id' }],
    });
    await this.extraSalaryModel.updateMany(filter, {
      $set: {
        status: {
          $cond: {
            if: { $eq: ['$earning', true] },
            then: EExtraSalaryStatus.Approved,
            else: EExtraSalaryStatus.Penalized,
          },
        },
      },
    });
    for (const { extra } of extras) {
      if (extra.isPoint) {
        // await
      }
    }
  }

  /**
   * TODO:
   * combine all remaining accumulated leave from previous year to one
   */
  // async yearlyStatistics() {
  //   return;
  // }
}
