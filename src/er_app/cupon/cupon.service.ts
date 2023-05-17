import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { ECategory, EModule } from 'src/common/util/enumn';
import { PaymentType } from 'src/common/util/schema.type';
import { AppRequest } from 'src/common/util/type';
import { GetPaymentDto } from './dto/get_payment.dto';
import { CreateCuponDto, UpdateCuponCodeDto } from './dto/create_cupon.dto';
import { CuponCode } from './schema/cupon_code.schema';
import { Cupon } from './schema/cupon.schema';

@Injectable()
export class CuponService extends CoreService {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Cupon.name) model: Model<Cupon>,
    @InjectModel(CuponCode.name) private readonly cuponCodeModel: Model<CuponCode>,
  ) {
    super(connection, model);
  }

  async createCupon({ category, cuponCodeIds, ...dto }: CreateCuponDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        if (dto.active_until && new Date(dto.active_until).getTime() <= Date.now())
          throw new BadRequestException('End date must be in the future');
        const cuponDto = { ...dto, category: { ...category, type: ECategory.Cupon, name: 'type' } };
        if (cuponCodeIds) {
          const cuponCodes = await this.find({
            filter: { _id: { $in: cuponCodeIds } },
            options: { lean: false },
            projection: { _id: 1 },
          });
          cuponDto['cuponCodes'] = cuponCodes;
        }
        return await this.create({
          dto: cuponDto,
          session,
        });
      },
      req,
      res,
      audit: { name: 'cupon_create', module: EModule.ErApp, payload: { category, ...dto } },
    });
  }

  async createCuponCode(dto: CreateCuponDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        return await this.create({ dto, custom: this.cuponCodeModel, session });
      },
      req,
      res,
      audit: { name: 'cupon-code_create', module: EModule.ErApp, payload: dto },
    });
  }

  async updateCuponCode({ cuponId, codes }: UpdateCuponCodeDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        for (const code of codes) {
          await this.findById({ id: code.codeId, custom: this.cuponCodeModel });
          const update = {};
          if (code.add) {
            update['$push'] = { cuponCodes: code.codeId };
          } else {
            update['$pull'] = { cuponCodes: code.codeId };
          }
          await this.findByIdAndUpdate({ id: cuponId, session, update });
        }
        return await this.findById({ id: cuponId });
      },
      req,
      res,
      audit: { name: 'cupon_update-cupon-code', module: EModule.ErApp, payload: { cuponId, codes } },
    });
  }

  async getPayment({
    originalAmount,
    cuponCode,
    paymentMethod,
    paymentProof,
  }: GetPaymentDto): Promise<PaymentType> {
    const payment: PaymentType = {
      amount: originalAmount,
      originalAmount: originalAmount,
      paymentMethod,
      paymentProof,
    };
    const filter = { active: true };
    if (cuponCode)
      filter['cuponCodes'] = { $eleMatch: { code: cuponCode, active: true, numUsable: { $gt: 0 } } };
    else filter['$max'] = { activeOnAmount: { $gt: originalAmount } };
    const cupon: Cupon = await this.findOne({
      filter,
      errorOnNotFound: false,
      options: {
        populate: 'cuponCodes',
      },
    });
    if (cupon) {
      const amount =
        originalAmount +
        (cupon.isPercentage ? originalAmount * cupon.allowanceAmount : cupon.allowanceAmount);
      payment.amount = amount;
    }
    return payment;
  }
}
