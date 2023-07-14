import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { ECategory, EExtraSalaryStatus, EModule } from 'src/common/util/enumn';
import { AppRequest, TriggeredBy } from 'src/common/util/type';
import { PointTransaction } from 'src/point_transaction/point_transaction.schema';
import { ExtraSalary } from 'src/salary/schema/extra_salary.schema';
import { ApproveExtraSalryDto } from '../dto/extra_salary.dto';

@Injectable()
export class ExtraSalaryService extends CoreService<ExtraSalary> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(ExtraSalary.name) model: Model<ExtraSalary>,
    @InjectModel(ExtraSalary.name) private readonly extraSalaryModel: Model<ExtraSalary>,
    @InjectModel(PointTransaction.name) private readonly pointTransactionModel: Model<PointTransaction>,
  ) {
    super(connection, model);
  }

  async approveExtraSalary(
    dto: ApproveExtraSalryDto,
    req?: AppRequest,
    res?: Response,
    triggeredBy?: TriggeredBy,
  ) {
    return this.makeTransaction({
      action: async (ses) => {
        const session = triggeredBy?.session ?? ses;
        const { late, id } = dto;
        const update = {
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
        };

        const docs = late
          ? (
              await this.updateMany({
                ...update,
                filter: { $and: [{ createdAt: new Date(), status: EExtraSalaryStatus.Pending }] },
              })
            ).next
          : (await this.findAndUpdate({ ...update, id })).next;

        for (const doc of Array.isArray(docs) ? docs : [docs]) {
          await doc.populate([
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
          ]);

          const {
            extra,
            user,
            earning,
            category: { name },
          } = doc;
          if (extra.isPoint) {
            this.findAndUpdate({
              filter: { _id: user._id },
              update: { $inc: { 'user.currentOrganization.numPoint': extra.amount * (late ? -1 : 1) } },
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
      req,
      res: triggeredBy ? undefined : res,
      audit: {
        name: 'approve-extrasalary',
        module: EModule.Salary,
        payload: dto,
        triggeredBy: triggeredBy?.service,
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
