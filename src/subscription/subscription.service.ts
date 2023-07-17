import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/core/service/core.service';
import { Subscription } from './subscription.schema';
import { Promotion } from '../promotion/promotion.schema';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from 'src/subscription/subscription.dto';
import { AppRequest } from 'src/core/util/type';
import { Response } from 'express';
import { EModule } from 'src/core/util/enumn';

@Injectable()
export class SubscriptionService extends CoreService<Subscription> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Subscription.name) model: Model<Subscription>,
    @InjectModel(Promotion.name) private readonly promotionModel: Model<Promotion>,
  ) {
    super(connection, model);
  }

  async createSubscription(dto: CreateSubscriptionDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const { promotionId, ...payload } = dto;
        let activePromotion;
        if (promotionId)
          activePromotion = await this.findById({ id: promotionId, custom: this.promotionModel });
        return this.create({ dto: { ...payload, activePromotion }, session });
      },
      req,
      res,
      audit: { name: 'create-subscription', module: EModule.Subscription, payload: dto },
    });
  }

  async updateSubscription(dto: UpdateSubscriptionDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const { id, routes, prices, promotionId, ...payload } = dto;
        const subscription = await this.findById({ id });
        const allowedRoutes = new Set(subscription.allowedRoutes);
        const price = subscription.price;
        let activePromotion = subscription.activePromotion;
        if (routes) {
          routes.forEach((each) => {
            if (each.add) allowedRoutes.add(each.route);
            else allowedRoutes.delete(each.route);
          });
        }
        if (prices) {
          prices.forEach((each) => {
            const empPriceInd = price.findIndex((eP) => eP.numEmployee === each.numEmployee);
            if (empPriceInd) {
              const dayPriceInd = price[empPriceInd].dayPrice.findIndex((dP) => dP.numDay === each.numDay);
              if (dayPriceInd) price[empPriceInd].dayPrice[dayPriceInd].price = each.price;
            } else
              price.push({
                numEmployee: each.numEmployee,
                dayPrice: [{ numDay: each.numDay, price: each.price }],
              });
          });
        }
        if (promotionId)
          activePromotion = await this.findById({ id: promotionId, custom: this.promotionModel });
        const update = { ...payload, price, routes, activePromotion };
        return await this.findAndUpdate({ id, update, session });
      },
      req,
      res,
      audit: { name: 'update-subscription', module: EModule.Subscription, payload: dto },
    });
  }
}
