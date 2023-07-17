import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { ExtraSalary } from 'src/salary/schema/extra_salary.schema';
import { ECategory, EExtraSalaryStatus } from '../util/enumn';
import { User } from 'src/user/schema/user.schema';
import { CoreService } from './core.service';
import { PointTransaction } from 'src/point_transaction/point_transaction.schema';

@Injectable()
export class UtilService extends CoreService<User> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(User.name) model: Model<User>,
    @InjectModel(ExtraSalary.name) private readonly extraSalaryModel: Model<ExtraSalary>,
    @InjectModel(PointTransaction.name) private readonly pointTransactionModel: Model<PointTransaction>,
  ) {
    super(connection, model);
  }

  async approveExtraSalary() {
    return this.makeTransaction({
      action: async (session) => {
        const filter = { $and: [{ createdAt: new Date(), status: EExtraSalaryStatus.Pending }] };
        const extras = await this.extraSalaryModel.find(filter, null, {
          populate: [
            {
              path: 'user',
              select: '_id currentOrganization',
              populate: [
                {
                  path: 'currentOrganization',
                  select: 'numPoint',
                },
              ],
            },
            {
              path: 'category',
              select: 'name',
            },
          ],
        });
        this.updateMany({
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
        for (const {
          extra,
          user,
          earning,
          category: { name },
        } of extras) {
          if (extra.isPoint) {
            this.findAndUpdate({
              filter: { _id: user._id },
              update: { $inc: { 'user.currentOrganization.numPoint': extra.amount } },
              session,
            });
            this.create({
              dto: { numPoint: extra.amount, earning, user },
              category: {
                type: ECategory.PointTransaction,
                category: name,
              },
              custom: this.pointTransactionModel,
              session,
            });
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
