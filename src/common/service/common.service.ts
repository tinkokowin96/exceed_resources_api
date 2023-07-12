import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { ExtraSalary } from 'src/salary/schema/extra_salary.schema';
import { EExtraSalaryStatus } from '../util/enumn';
import { User } from 'src/user/schema/user.schema';
import { CoreService } from './core.service';

@Injectable()
export class CommonService extends CoreService<User> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(User.name) model: Model<User>,
    @InjectModel(ExtraSalary.name) private readonly extraSalaryModel: Model<ExtraSalary>,
  ) {
    super(connection, model);
  }

  async approveExtraSalary() {
    return this.makeTransaction({
      action: async (session) => {
        const filter = { $and: [{ createdAt: new Date(), status: EExtraSalaryStatus.Pending }] };
        const extras = await this.extraSalaryModel.find(filter, null, {
          populate: [{ path: 'user', select: '_id' }],
        });
        await this.updateMany({
          filter,
          session,
          update: {
            $set: {
              status: {
                $cond: {
                  if: { $eq: ['$earning', true] },
                  then: EExtraSalaryStatus.Approved,
                  else: EExtraSalaryStatus.Penalized,
                },
              },
            },
          },
        });
        for (const { extra, user } of extras) {
          if (extra.isPoint) {
            await this.findAndUpdate({ filter: { _id: user._id }, update: {}, session });
          }
        }
      },
    });
  }

  /**
   * TODO: some notifications come from BE (push notification) and some will be local notification(FE handle it)
   * sendNotification()
   */

  /**
   * TODO:
   * combine all remaining accumulated leave from previous year to one
   */
  // async yearlyStatistics() {
  //   return;
  // }
}
