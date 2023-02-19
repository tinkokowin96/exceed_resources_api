import { Inject, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import {
  ClientSession,
  Connection,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery,
} from 'mongoose';
import { Audit } from '../schema/audit.schema';
import { AUDIT_MODEL } from '../util/constant';
import { EUser } from '../util/enumn';
import { responseError } from '../util/response_error';
import { AppRequest } from '../util/type';

type MakeTransactionType = {
  action: (session: ClientSession) => Promise<any>;
  req: AppRequest;
  res?: Response;
  callback?: () => any;
  audit?: Pick<Audit, 'name' | 'module' | 'payload'>;
};

export abstract class CoreService {
  @Inject(AUDIT_MODEL) private readonly auditModel: Model<Audit>;
  constructor(protected readonly connection: Connection, protected readonly model?: Model<any>) {}

  async create(dto: any, custom?: Model<any>, session?: ClientSession) {
    const model = custom ?? this.model;
    const doc = new model({
      ...dto,
      _id: new Types.ObjectId(),
    });
    const saved = await doc.save({ session });
    return { next: saved };
  }

  async find(
    filter?: FilterQuery<any>,
    custom?: Model<any>,
    projection?: ProjectionType<any>,
    options?: QueryOptions<any>,
  ) {
    const model = custom ?? this.model;
    const docs = await model.find(filter, projection, {
      ...options,
      lean: true,
    });
    if (docs) return docs;
    else throw new NotFoundException('Documents not found with this query');
  }

  async findOne(
    filter: FilterQuery<any>,
    custom?: Model<any>,
    projection?: ProjectionType<any>,
    options?: QueryOptions<any>,
  ) {
    const model = custom ?? this.model;
    const doc = await model.findOne(filter, projection, {
      lean: true,
      ...options,
    });
    if (doc) return doc;
    else throw new NotFoundException('Document not found with this query');
  }

  async findById(
    id: string | Types.ObjectId,
    custom?: Model<any>,
    projection?: ProjectionType<any>,
    options?: QueryOptions<any>,
  ) {
    const model = custom ?? this.model;
    const doc = await model.findById(id, projection, {
      lean: true,
      ...options,
    });
    if (doc) return doc;
    else throw new NotFoundException('Document not found with this id');
  }

  async findByIdAndUpdate(
    id: string,
    update: UpdateQuery<any>,
    custom?: Model<any>,
    options?: QueryOptions<any>,
  ) {
    const model = custom ?? this.model;
    const prev = await model.findById(id, null, {
      lean: true,
    });
    if (!prev) throw new NotFoundException('Document not found with this id');

    const next = await model.findByIdAndUpdate(
      id,
      { ...update, updatedAt: new Date() },
      { ...options, new: true },
    );

    return {
      prev,
      next,
    };
  }

  async updateManyById(
    ids: string[],
    update: UpdateQuery<any>,
    custom?: Model<any>,
    options?: QueryOptions<any>,
  ) {
    const model = (this.model ?? custom) as Model<any>;
    const prev = await model.find({ _id: { $in: ids } }, null, {
      lean: true,
    });
    if (!prev || !prev.length) throw new NotFoundException('Documents not found with these ids');

    const next = await model.updateMany(
      { _id: { $in: ids } },
      { ...update, updatedAt: new Date() },
      { ...options, new: true },
    );

    return {
      prev,
      next,
    };
  }

  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }

  async makeTransaction({ action, req, res: response, callback, audit }: MakeTransactionType) {
    const session = await this.startTransaction();
    try {
      const res = await action(session);
      if (callback) await callback();
      session.commitTransaction();
      session.endSession();

      if (audit) {
        const user = {};
        if (req.user) {
          if (req.user.type === EUser.ErApp) user['submittedErUser'] = req.user;
          else user['submittedOUser'] = req.user;
        } else user['submittedIP'] = req.ip;
        // this.create(
        //   {
        //     ...audit,
        //     ...user,
        //     prev: res?.prev,
        //     next: res?.next,
        //   },
        //   this.auditModel,
        // );
      }

      const responseObj: any = {};
      if (typeof res === 'string') responseObj['message'] = res;
      else responseObj['data'] = res;
      if (response) response.send(responseObj);
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      responseError(response, error);
    }
  }
}
