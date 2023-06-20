import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExtraSalary } from 'src/extra_salary/extra_salary.schema';
import { EExtraSalaryStatus } from '../util/enumn';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class ScheduledJobService {
  constructor(
    @InjectModel(ExtraSalary.name) private readonly extraSalaryModel: Model<ExtraSalary>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  doStatistics() {
    this.approveExtraSalary();
    this.yearlyStatistics();
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
    }
  }

  async yearlyStatistics() {
    return;
  }
}
