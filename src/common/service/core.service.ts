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
import { ECategory, EUser } from '../util/enumn';
import { responseError } from '../util/response_error';
import { AppRequest } from '../util/type';

type QueryType = {
  custom?: Model<any>;
  options?: QueryOptions<any>;
  projection?: ProjectionType<any>;
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
  filter: FilterQuery<any>;
};

type FindByIdType = QueryType & {
  id: string;
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
  audit?: Pick<Audit, 'name' | 'module' | 'payload'>;
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
      payload,
      _id: new Types.ObjectId(),
    });
    const saved = await doc.save({ session });
    return { next: saved };
  }

  async find({ filter, custom, options, projection }: FindType) {
    const model = custom ?? this.model;
    const docs = await model.find(filter, projection, {
      ...options,
      lean: true,
    });
    if (docs) return docs;
    else throw new NotFoundException('Documents not found with this query');
  }

  async findOne({ filter, custom, options, projection }: FindType) {
    const model = custom ?? this.model;
    const doc = await model.findOne(filter, projection, {
      lean: true,
      ...options,
    });
    if (doc) return doc;
    else throw new NotFoundException('Document not found with this query');
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

      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      responseError(response, error);
    }
  }
}
