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
import { Category } from 'src/category/category.schema';
import { Audit } from '../schema/audit.schema';
import { AUDIT_MODEL } from '../util/constant';
import { ECategory } from '../util/enumn';
import { responseError } from '../util/response_error';
import { AppRequest, Type } from '../util/type';

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

type GetOptionsType<T> = Pick<
  FindType<T>,
  'filter' | 'options' | 'take' | 'page' | 'sort' | 'startDate' | 'endDate'
>;

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

type UpdateManyType<T> = Omit<FindByIdAndUpdateType<T>, 'id'> & {
  filter: FilterQuery<T>;
  update: UpdateQuery<T>;
  session: ClientSession;
  pagination?: Omit<GetOptionsType<T>, 'filter' | 'options'>;
};

type MakeTransactionType = {
  action: (session: ClientSession) => Promise<any>;
  req: AppRequest;
  res?: Response;
  callback?: () => any;
  audit?: Pick<Audit, 'name' | 'module' | 'payload' | 'triggeredBy'>;
};

export abstract class CoreService<T> {
  @Inject(AUDIT_MODEL) private readonly auditModel: Model<Audit>;
  constructor(
    protected readonly connection: Connection,
    protected readonly model?: Model<T>,
    protected readonly categoryModel?: Model<Type<Category, T>>,
  ) {}

  getOptions<K = T>({
    options,
    filter,
    sort,
    take,
    page = 1,
    startDate,
    endDate,
  }: GetOptionsType<Type<K, T>>) {
    const opt = { lean: true, ...options };
    if (sort) opt.sort = sort;
    if (take) {
      opt.skip = take * page;
      opt.limit = take;
    }
    if (startDate) {
      (filter as any).createdAt = { $gte: startDate, $lte: endDate ?? startDate };
    }
    return opt;
  }

  async create<K = T>({ dto, session, category, custom }: CreateType<Type<K, T>>) {
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
    await doc.save({ session });
    return doc;
  }

  async find<K = T>({
    filter,
    custom,
    options,
    projection,
    errorOnNotFound = true,
    ...pagination
  }: FindType<Type<K, T>>) {
    const model: Model<Type<K, T>> = (custom ?? this.model) as any;
    const opt = this.getOptions({ options, filter, ...pagination });
    const docs = await model.find(filter, projection, {
      lean: true,
      ...opt,
    });
    if (docs) {
      const data = { items: docs };
      if (pagination.take) data['numItems'] = await model.countDocuments();
      return data;
    } else if (errorOnNotFound) throw new NotFoundException('Documents not found with this query');
    else return null;
  }

  async findOne<K = T>({
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

  async findById<K = T>({ id, custom, options, projection }: FindByIdType<Type<K, T>>) {
    const model: Model<Type<K, T>> = (custom ?? this.model) as any;
    const doc = await model.findById(id, projection, {
      lean: true,
      ...options,
    });
    if (doc) return doc;
    else throw new NotFoundException('Document not found with this id');
  }

  async findByIdAndUpdate<K = T>({
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

  async updateMany<K = T>({
    filter,
    update,
    session,
    custom,
    options,
    pagination,
  }: UpdateManyType<Type<K, T>>) {
    const model: Model<Type<K, T>> = (custom ?? this.model) as any;
    const opt = pagination ? this.getOptions({ filter, options, ...pagination }) : { ...options };
    const prev = await model.find(filter, null, {
      lean: true,
      opt,
    });
    if (!prev || !prev.length) throw new NotFoundException('Documents not found with these ids');

    const next = await model.updateMany(
      filter,
      { ...update, updatedAt: new Date() },
      { ...options, session, new: true },
    );

    const data = {
      prev,
      next,
      numItems: null,
    };

    if (pagination) data.numItems = await model.countDocuments();
    return data;
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
        await this.create({
          dto: { ...audit, ...user, response: res } as any,
          custom: this.auditModel as any,
          session,
        });
      }

      const responseObj: any = {};
      if (typeof res === 'string') responseObj['message'] = res;
      else responseObj['data'] = res;

      await session.commitTransaction();
      session.endSession();

      if (!audit) return res.next ?? res;
      else if (response) response.send(responseObj);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      responseError(response, error);
    }
  }
}
