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

type QueryType = {
  custom?: Model<any>;
  options?: QueryOptions<any>;
  projection?: ProjectionType<any>;
  errorOnNotFound?: boolean;
};

type CreateType = Pick<QueryType, 'custom'> & {
  dto: any;
  session: ClientSession;
  category?: {
    categoryId?: string;
    category?: string;
    name?: string;
    type: ECategory;
  };
};

type FindType = QueryType & {
  filter?: FilterQuery<any>;
  take?: number;
  page?: number;
  sort?: string;
  startDate?: string;
  endDate?: string;
};

type FindByIdType = QueryType & {
  id: string | Types.ObjectId;
};

type FindByIdAndUpdateType = Omit<FindByIdType, 'projection'> & {
  update: UpdateQuery<any>;
  session: ClientSession;
};

type UpdateManyByIdType = Omit<FindByIdAndUpdateType, 'id'> & {
  ids: string[];
  update: UpdateQuery<any>;
  session: ClientSession;
};

type MakeTransactionType = {
  action: (session: ClientSession) => Promise<any>;
  req: AppRequest;
  res?: Response;
  callback?: () => any;
  audit?: Pick<Audit, 'name' | 'module' | 'payload' | 'triggerBy' | 'triggerType'>;
};

export abstract class CoreService {
  @Inject(AUDIT_MODEL) private readonly auditModel: Model<Audit>;
  constructor(
    protected readonly connection: Connection,
    protected readonly model?: Model<any>,
    protected readonly categoryModel?: Model<Category>,
  ) {}

  async create({ dto, session, category, custom }: CreateType) {
    const model = custom ?? this.model;
    const payload = dto;
    if (category) {
      let cat;
      if (!this.categoryModel) throw new InternalServerErrorException('Category model need to initialize');
      if (!category.category && !category.categoryId)
        throw new BadRequestException('Required organization category');
      if (category.categoryId)
        cat = await this.findById({ id: category.categoryId, custom: this.categoryModel });
      else
        cat = await (
          await this.create({
            dto: { name: category, type: category.type },
            session,
            custom: this.categoryModel,
          })
        ).next;
      payload[category.name ?? 'category'] = cat;
    }
    const doc = new model({
      ...payload,
      _id: new Types.ObjectId(),
    });
    return await doc.save({ session });
  }

  async find({
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
  }: FindType) {
    const model = custom ?? this.model;
    const opt = { lean: true, ...options };
    if (sort) opt.sort = sort;
    if (take) {
      opt.skip = take * page;
      opt.limit = take;
    }
    if (startDate) {
      filter['createdAt'] = { $gte: startDate, $lte: endDate ?? startDate };
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

  async findOne({ filter, custom, options, projection, errorOnNotFound = true }: FindType) {
    const model = custom ?? this.model;
    const doc = await model.findOne(filter, projection, {
      lean: true,

      ...options,
    });
    if (doc) return doc;
    else if (errorOnNotFound) throw new NotFoundException('Document not found with this query');
    else return null;
  }

  async findById({ id, custom, options, projection }: FindByIdType) {
    const model = custom ?? this.model;
    const doc = await model.findById(id, projection, {
      lean: true,
      ...options,
    });
    if (doc) return doc;
    else throw new NotFoundException('Document not found with this id');
  }

  async findByIdAndUpdate({ id, update, session, custom, options }: FindByIdAndUpdateType) {
    const model = custom ?? this.model;
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

  async updateManyById({ ids, update, session, custom, options }: UpdateManyByIdType) {
    const model = (this.model ?? custom) as Model<any>;
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
