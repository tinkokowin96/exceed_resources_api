import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { ECategory, EModule } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { CreateCuponDto } from '../dto/cupon.dto';
import { CreateCuponCodeDto, UpdateCuponCodeDto } from '../dto/cupon_code.dto';
import { Cupon } from '../schema/cupon.schema';
import { CuponCode } from '../schema/cupon_code.schema';

@Injectable()
export class CuponService extends CoreService<Cupon> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Cupon.name) model: Model<Cupon>,
    @InjectModel(CuponCode.name) private readonly cuponCodeModel: Model<CuponCode>,
  ) {
    super(connection, model);
  }

  async createCupon(dto: CreateCuponDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const { category, ...payload } = dto;
        if (payload.active_until && new Date(payload.active_until).getTime() <= Date.now())
          throw new BadRequestException('End date must be in the future');

        return await this.create({
          dto: payload,
          category: category ? { ...category, type: ECategory.Cupon } : undefined,
          session,
        });
      },
      req,
      res,
      audit: { name: 'create-cupon', module: EModule.ErApp, payload: dto },
    });
  }

  async createCuponCode(dto: CreateCuponCodeDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        return await this.create({ dto, custom: this.cuponCodeModel, session });
      },
      req,
      res,
      audit: { name: 'create-cupon-code', module: EModule.ErApp, payload: dto },
    });
  }

  async updateCuponCode(dto: UpdateCuponCodeDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const { cuponId, codes } = dto;
        for (const code of codes) {
          await this.findById({ id: code.codeId, custom: this.cuponCodeModel });
          const update = {};
          if (code.add) {
            update['$push'] = { cuponCodes: code.codeId };
          } else {
            update['$pull'] = { cuponCodes: code.codeId };
          }
          await this.findAndUpdate({ id: cuponId, session, update });
        }
        return await this.findById({ id: cuponId });
      },
      req,
      res,
      audit: { name: 'update-cupon-code', module: EModule.ErApp, payload: dto },
    });
  }

  // async getPayment(dto: GetPaymentDto): Promise<Payment> {
  //   const { cuponCodeId, promotionId, originalAmount, ...payload } = dto;
  //   const payment: Payment = {
  //     originalAmount,
  //     amount: originalAmount,
  //     ...payload,
  //   };
  //   if (cuponCodeId) {
  //   }
  //   const filter = { active: true };
  //   if (cuponCodeId)
  //     filter['cuponCodes'] = { $eleMatch: { code: cuponCode, active: true, numUsable: { $gt: 0 } } };
  //   else filter['$max'] = { activeOnAmount: { $gt: originalAmount } };
  //   const cupon: Cupon = await this.findOne({
  //     filter,
  //     errorOnNotFound: false,
  //     options: {
  //       populate: 'cuponCodes',
  //     },
  //   });
  //   if (cupon) {
  //     const amount =
  //       originalAmount +
  //       (cupon.isPercentage ? originalAmount * cupon.allowanceAmount : cupon.allowanceAmount);
  //     payment.amount = amount;
  //   }
  //   return payment;
  // }
}
