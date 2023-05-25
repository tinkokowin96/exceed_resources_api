import { BadRequestException, Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
import { Category } from 'src/category/schema/category.schema';
import { Audit } from '../schema/audit.schema';
import { AUDIT_MODEL } from '../util/constant';
import { ECategory, EServiceTrigger } from '../util/enumn';
import { responseError } from '../util/response_error';
import { AppRequest } from '../util/type';
import { CoreSchema } from '../schema/core.shema';

type Type<K, T> = K extends T ? T : K;

type QueryType<T> = {
  custom?: Model<T>;
  options?: QueryOptions<T>;
  projection?: ProjectionType<T>;
  errorOnNotFound?: boolean;
};

type CreateType<T> = Pick<QueryType<T>, 'custom'> & {
  dto: Omit<T, '_id' | 'createdAt' | 'updatedAt'>;
  session: ClientSession;
  category?: {
    categoryId?: string;
    category?: string;
    name?: string;
    type: ECategory;
  };
};

type FindType<T> = QueryType<T> & {
  filter?: FilterQuery<T>;
  take?: number;
  page?: number;
  sort?: string;
  startDate?: string;
  endDate?: string;
};

type FindByIdType<T> = QueryType<T> & {
  id: string | Types.ObjectId;
};

type FindByIdAndUpdateType<T> = Omit<FindByIdType<T>, 'projection'> & {
  update: UpdateQuery<T>;
  session: ClientSession;
};

type UpdateManyByIdType<T> = Omit<FindByIdAndUpdateType<T>, 'id'> & {
  ids: string[];
  update: UpdateQuery<T>;
  session: ClientSession;
};

type MakeTransactionType = {
  action: (session: ClientSession) => Promise<any>;
  req: AppRequest;
  res?: Response;
  callback?: () => any;
  audit?: Pick<Audit, 'name' | 'module' | 'payload' | 'triggerBy' | 'triggerType'>;
};

export abstract class CoreService<T extends CoreSchema> {
  @Inject(AUDIT_MODEL) private readonly auditModel: Model<Audit>;
  constructor(
    protected readonly connection: Connection,
    protected readonly model?: Model<T>,
    protected readonly categoryModel?: Model<Type<Category, T>>,
  ) {}

  async create<K extends CoreSchema = T>({ dto, session, category, custom }: CreateType<Type<K, T>>) {
    const model: Model<Type<K, T>> = (custom ?? this.model) as any;
    const payload = dto;
    if (category) {
      let cat;
      if (!this.categoryModel) throw new InternalServerErrorException('Category model need to initialize');
      if (!category.category && !category.categoryId)
        throw new BadRequestException('Required organization category');
      if (category.categoryId)
        cat = await this.findById({ id: category.categoryId, custom: this.categoryModel });
      else
        cat = await this.create({
          dto: { name: category.category, type: category.type } as any,
          session,
          custom: this.categoryModel,
        });
      payload[category.name ?? 'category'] = cat;
    }
    const doc = new model({
      ...payload,
      _id: new Types.ObjectId(),
    });
    return await doc.save({ session });
  }

  async find<K extends CoreSchema = T>({
    filter,
    custom,
    options,
    projection,
    take,
    page = 1,
    sort,
    startDate,
    endDate,
    errorOnNotFound = true,
  }: FindType<Type<K, T>>) {
    const model: Model<Type<K, T>> = (custom ?? this.model) as any;
    const opt = { lean: true, ...options };
    if (sort) opt.sort = sort;
    if (take) {
      opt.skip = take * page;
      opt.limit = take;
    }
    if (startDate) {
      filter.createdAt = { $gte: startDate, $lte: endDate ?? startDate };
    }
    const docs = await model.find(filter, projection, {
      lean: true,
      ...options,
    });

    if (docs) {
      const data = { items: docs };
      if (take) data['numItems'] = await model.countDocuments();
      return data;
    } else if (errorOnNotFound) throw new NotFoundException('Documents not found with this query');
    else return null;
  }

  async findOne<K extends CoreSchema = T>({
    filter,
    custom,
    options,
    projection,
    errorOnNotFound = true,
  }: FindType<Type<K, T>>) {
    const model: Model<Type<K, T>> = (custom ?? this.model) as any;
    const doc = await model.findOne(filter, projection, {
      lean: true,
      ...options,
    });
    if (doc) return doc;
    else if (errorOnNotFound) throw new NotFoundException('Document not found with this query');
    else return null;
  }

  async findById<K extends CoreSchema = T>({ id, custom, options, projection }: FindByIdType<Type<K, T>>) {
    const model: Model<Type<K, T>> = (custom ?? this.model) as any;
    const doc = await model.findById(id, projection, {
      lean: true,
      ...options,
    });
    if (doc) return doc;
    else throw new NotFoundException('Document not found with this id');
  }

  async findByIdAndUpdate<K extends CoreSchema = T>({
    id,
    update,
    session,
    custom,
    options,
  }: FindByIdAndUpdateType<Type<K, T>>) {
    const model: Model<Type<K, T>> = (custom ?? this.model) as any;
    const prev = await model.findById(id, null, {
      lean: true,
    });
    if (!prev) throw new NotFoundException('Document not found with this id');

    const next = await model.findByIdAndUpdate(
      id,
      { ...update, updatedAt: new Date() },
      { ...options, session, new: true },
    );

    return {
      prev,
      next,
    };
  }

  async updateManyById<K extends CoreSchema = T>({
    ids,
    update,
    session,
    custom,
    options,
  }: UpdateManyByIdType<Type<K, T>>) {
    const model: Model<Type<K, T>> = (custom ?? this.model) as any;
    const prev = await model.find({ _id: { $in: ids } }, null, {
      lean: true,
    });
    if (!prev || !prev.length) throw new NotFoundException('Documents not found with these ids');

    const next = await model.updateMany(
      { _id: { $in: ids } },
      { ...update, updatedAt: new Date() },
      { ...options, session, new: true },
    );

    return {
      prev,
      next,
    };
  }

  async makeTransaction({ action, req, res: response, callback, audit }: MakeTransactionType) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const res = await action(session);
      if (callback) await callback();

      if (audit) {
        const user = {};
        if (req.user) user['submittedUser'] = req.user;
        else user['submittedIP'] = req.ip;
        // await this.create({
        //   dto: { ...audit, ...user, prev: res?.prev, next: res?.next },
        //   custom: this.auditModel,
        //   session,
        // });
      }

      const responseObj: any = {};
      if (typeof res === 'string') responseObj['message'] = res;
      else responseObj['data'] = res;

      await session.commitTransaction();
      session.endSession();
      if (response) response.send(responseObj);
      else if (audit.triggerBy) {
        if (audit.triggerType === EServiceTrigger.Update) return res.next;
        else return res;
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      responseError(response, error);
    }
  }
}
