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
      if (Date.now() < blockUntil.getTime())
        throw new ThrottlerException(
          `This ${filterObj['address'] ? 'address' : 'account'} is blocked until ${blockUntil}`,
        );
      else
        await this.model.findOneAndUpdate(filterObj, {
          $set: {
            blockedTime: null,
            blockedDay: 0,
            numLimit: 10,
          },
        });
    }

    if (totalHits > limit) {
      let remainingLimit = 9;
      let numLimit, blockedDay, blockedForever, blockedTime;
      if (doc) {
        if (doc.numLimit <= 10) {
          numLimit = doc.numLimit + 1;
          remainingLimit = 10 - numLimit;
          blockedDay = doc.blockedDay;
          blockedForever = false;
        } else {
          numLimit = 0;
          blockedDay = doc.blockedDay === 0 ? 0.5 : doc.blockedDay === 0.5 ? 1 : doc.blockedDay === 1 ? 3 : 0;

          blockedForever = blockedDay === 0 ? true : false;
          if (blockedForever || blockedDay !== 0) blockedTime = new Date();
        }
        await this.model.findOneAndUpdate(filterObj, {
          $set: {
            numLimit,
            blockedDay,
            blockedForever,
            lastLimitTime: new Date(),
            blockedTime,
          },
        });
      } else {
        const doc = new this.model({
          _id: new Types.ObjectId(),
          lastLimitTime: new Date(),
          ...filterObj,
        });
        await doc.save();
      }

      throw new ThrottlerException(
        `Limit exceeded, retry ${format(
          Date.now() + timeToExpire * 1000,
        )} and you can only exceed limit ${remainingLimit} times not to be blocked`,
      );
    }

    if (doc && doc.numLimit !== 10)
      this.model.findOneAndUpdate(filterObj, {
        $set: {
          numLimit: 10,
        },
      });
    return true;
  }

  protected throwException(message: string): void {
    throw new ThrottlerException(message);
  }
}
