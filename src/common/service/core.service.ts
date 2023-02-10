import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { Connection, FilterQuery, Model, ProjectionType, QueryOptions, Types, UpdateQuery } from 'mongoose';
import { CoreSchema } from '../schema/core.shema';
import { responseError } from '../util/response_error';
import { AuditType } from '../util/type';

type MakeTransactionType = {
  action: () => Promise<any>;
  res?: Response;
  callback?: () => any;
  audit?: AuditType;
};

export abstract class CoreService<Schema extends CoreSchema = CoreSchema> {
  constructor(protected readonly connection: Connection, protected readonly model?: Model<Schema>) {}

  async create(dto: Omit<Partial<Schema>, '_id' | 'updatedAt'>, custom?: Model<Schema>) {
    const model = custom ?? this.model;
    const doc = new model({
      ...dto,
      _id: new Types.ObjectId(),
    });
    const saved = await doc.save();
    return { next: saved };
  }

  async find(
    filter?: FilterQuery<any>,
    custom?: Model<any>,
    projection?: ProjectionType<any>,
    options?: QueryOptions<any>,
  ) {
    const model = (custom ?? this.model) as Model<Schema>;
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
    const model = (custom ?? this.model) as Model<Schema>;
    const doc = await model.findOne(filter, projection, {
      lean: true,
      ...options,
    });
    if (doc) return doc;
    else throw new NotFoundException('Document not found with this query');
  }

  async findById(
    id: string,
    custom?: Model<any>,
    projection?: ProjectionType<any>,
    options?: QueryOptions<any>,
  ) {
    const model = (custom ?? this.model) as Model<Schema>;
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
    const model = (this.model ?? custom) as Model<Schema>;
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
    const model = (this.model ?? custom) as Model<Schema>;
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

  async makeTransaction({ action, res: response, callback, audit }: MakeTransactionType) {
    const session = await this.startTransaction();
    try {
      const res = await action();
      if (callback) await callback();
      session.commitTransaction();
      session.endSession();

      if (audit) {
      }

      const responseObj: any = {};
      if (typeof res === 'string') responseObj['message'] = res;
      else responseObj['data'] = res;
      if (response) response.send(responseObj);
    } catch (error) {
      session.abortTransaction();
      session.endSession();
      responseError(response, error);
    }
  }
}
