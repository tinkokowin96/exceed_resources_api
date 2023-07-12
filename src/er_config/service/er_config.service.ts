import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/common/service/core.service';
import { EModule } from 'src/common/util/enumn';
import { AppRequest } from 'src/common/util/type';
import { User } from 'src/user/schema/user.schema';
import { CreateCurrencyDto, EditCurrencyDto } from '../dto/currency.dto';
import { EditErConfigDto } from '../dto/er_config.dto';
import { Currency } from '../schema/currency.schema';
import { ErConfig } from '../schema/er_config.schema';

@Injectable()
export class ErConfigService extends CoreService<ErConfig> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(ErConfig.name) model: Model<ErConfig>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Currency.name) private readonly currencyModel: Model<Currency>,
  ) {
    super(connection, model);
  }

  async editConfig(dto: EditErConfigDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const { baseCurrencyId, restrictedRoutes, superAdminId } = dto;
        const update = { restrictedRoutes };
        if (superAdminId) {
          const superAdmin = await this.findById({ id: superAdminId, custom: this.userModel });
          update['superAdmin'] = superAdmin;
        }
        if (baseCurrencyId) {
          const baseCurrency = await this.findById({ id: baseCurrencyId, custom: this.currencyModel });
          update['baseCurrency'] = baseCurrency;
        }
        return await this.findAndUpdate({ id: process.env.CONFIG_ID, update: { $set: update }, session });
      },
      req,
      res,
      audit: { name: 'edit-erconfig', module: EModule.ErApp, payload: dto },
    });
  }

  async createCurrency(dto: CreateCurrencyDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => await this.create({ dto, session, custom: this.currencyModel }),
      req,
      res,
      audit: { name: 'create-currency', module: EModule.ErApp, payload: dto },
    });
  }

  async editCurrency(dto: EditCurrencyDto, req: AppRequest, res: Response) {
    return this.makeTransaction({
      action: async (session) => {
        const { id, ...update } = dto;
        return await this.findAndUpdate({ id, update: { $set: update }, session });
      },
      req,
      res,
      audit: { name: 'edit-currency', module: EModule.ErApp, payload: dto },
    });
  }
}
