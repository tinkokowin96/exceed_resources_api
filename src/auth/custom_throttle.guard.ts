import { ExecutionContext } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import { ExceedLimit } from 'src/common/schema/exceed_limit.schema';
import { decrypt } from 'src/common/util/encrypt';
import { format } from 'timeago.js';

export class CustomThrottleGuard extends ThrottlerGuard {
  @InjectModel(ExceedLimit.name) private readonly model: Model<ExceedLimit>;

  async handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean> {
    const { req } = this.getRequestResponse(context);
    const tracker = this.getTracker(req);
    const key = this.generateKey(context, tracker);
    const { totalHits, timeToExpire } = await this.storageService.increment(key, ttl);
    const filterObj = {};

    if (req.cookies.user) {
      const user = await decrypt(process.env.ENC_PASSWORD, req.cookies.user);
      filterObj['userId'] = user.id;
    } else {
      filterObj['address'] = req.ip;
    }

    const doc = await this.model.findOne(filterObj);

    if (doc && (doc.blockedDay !== 0 || doc.blockedForever)) {
      if (doc.blockedForever)
        throw new ThrottlerException(
          `This ${
            filterObj['address'] ? 'address' : 'account'
          } is blocked for exceeding limt multiple time. Contact support to unblock`,
        );
      const blockUntil = moment(doc.blockedTime)
        .add(doc.blockedDay === 0.5 ? 12 : doc.blockedDay === 1 ? 24 : 72, 'hours')
        .toDate();
      if (Date.now() < blockUntil.getTime()) {
        const updated = { lastExceedTime: new Date() };
        let numAttempt;
        let nextBlock;
        switch (doc.blockedDay) {
          case 0.5:
            nextBlock = 1;
            numAttempt = doc.numAttemptHalfDayBlock + 1;
            if (numAttempt < 20) updated['numAttemptHalfDayBlock'] = doc.numAttemptHalfDayBlock + 1;
            else updated['blockedDay'] = 1;
            break;
          case 1:
            nextBlock = 3;
            numAttempt = doc.numAttemptOneDayBlock + 1;
            if (numAttempt < 20) updated['numAttemptOneDayBlock'] = doc.numAttemptOneDayBlock + 1;
            else updated['blockedDay'] = 3;
            break;
          case 3:
            nextBlock = 'Forever';
            numAttempt = doc.numAttemptThreeDayBlock + 1;
            if (numAttempt < 20) updated['numAttemptThreeDayBlock'] = doc.numAttemptThreeDayBlock + 1;
            else updated['blockedForever'] = true;
            break;

          default:
            break;
        }
        await this.model.findOneAndUpdate(filterObj, { $set: updated });

        throw new ThrottlerException(
          `This ${
            filterObj['address'] ? 'address' : 'account'
          } is blocked until ${blockUntil}  and if you keep trying ${
            20 - numAttempt
          } time before due, you'll be blocked ${
            typeof nextBlock === 'string' ? nextBlock : `${nextBlock} day`
          }`,
        );
      } else {
        await this.model.findOneAndUpdate(filterObj, {
          $set: {
            blockedTime: null,
            blockedDay: 0,
            numAttempt: 0,
            numAttemptHalfDayBlock: 0,
            numAttemptOneDayBlock: 0,
            numAttemptThreeDayBlock: 0,
          },
        });
      }
    }

    if (totalHits > limit) {
      let remainingAttempt;
      if (doc) {
        const updated = { lastExceedTime: new Date() };
        const numAttempt = doc.numAttempt + 1;
        remainingAttempt = 10 - numAttempt;

        if (numAttempt > 9) {
          updated['numAttempt'] = 0;
          updated['blockedDay'] = 0.5;
          updated['blockedTime'] = new Date();
        } else updated['numAttempt'] = numAttempt;
        await this.model.findOneAndUpdate(filterObj, { $set: updated });
      } else {
        remainingAttempt = 9;
        const doc = new this.model({
          _id: new Types.ObjectId(),
          lastExceedTime: new Date(),
          ...filterObj,
        });
        await doc.save();
      }

      throw new ThrottlerException(
        `Limit exceeded, retry ${format(
          Date.now() + timeToExpire * 1000,
        )} and you can only exceed limit ${remainingAttempt} times not to be blocked`,
      );
    }

    if (doc && doc.numAttempt !== 0) {
      await this.model.findOneAndUpdate(filterObj, {
        $set: {
          numAttempt: 0,
        },
      });
    }
    return true;
  }

  protected throwException(message: string): void {
    throw new ThrottlerException(message);
  }
}
