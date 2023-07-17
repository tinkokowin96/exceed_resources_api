import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/core/service/core.service';
import { EModule } from 'src/core/util/enumn';
import { AppRequest, TriggeredBy } from 'src/core/util/type';
import { CreateOConfigDto } from '../dto/o_config.dto';
import { OConfig } from '../schema/o_config.schema';
import { Field } from 'src/core/schema/field.schema';

@Injectable()
export class OConfigService extends CoreService<OConfig> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(OConfig.name) model: Model<OConfig>,
    @InjectModel(Field.name) private readonly fieldModel: Model<Field>,
  ) {
    super(connection, model);
  }

  async createOConfig(dto: CreateOConfigDto, req: AppRequest, res: Response, trigger?: TriggeredBy) {
    return this.makeTransaction({
      action: async (ses) => {
        const { overtimeFormFieldIds, workDays, ...payload } = dto;
        const session = trigger?.session ?? ses;
        const overtimeForm = (
          await this.find({
            filter: { _id: { $in: overtimeFormFieldIds } },
            custom: this.fieldModel,
          })
        ).items;
        const days = workDays.reduce((prev, curr) => {
          prev.push(...curr.days);
          return prev;
        }, []);
        if (days.length !== 7)
          throw new BadRequestException('Required seven work day for a week, with one config for a day');
        return await this.create({ dto: { ...payload, overtimeForm, workDays }, session });
      },
      req,
      res: trigger ? undefined : res,
      audit: {
        name: 'create-oconfig',
        module: EModule.Organization,
        payload: dto,
        triggeredBy: trigger?.service,
      },
    });
  }
}
