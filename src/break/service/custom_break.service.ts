import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CommonService } from 'src/core/service/common.service';
import { CoreService } from 'src/core/service/core.service';
import { EModule } from 'src/core/util/enumn';
import { AppRequest } from 'src/core/util/type';
import { RequestCustomBreakDto } from '../dto/custom_break.dto';
import { CustomBreak } from '../schema/custom_break.schema';
import { CustomBreakConfig } from '../schema/custom_break_config.schema';

@Injectable()
export class CustromBreakService extends CoreService<CustomBreak> {
	constructor(
		@InjectConnection() connection: Connection,
		@InjectModel(CustomBreak.name) model: Model<CustomBreak>,
		@InjectModel(CustomBreakConfig.name)
		private readonly customBreakConfigModel: Model<CustomBreakConfig>,
		private readonly commonService: CommonService,
	) {
		super(connection, model);
	}

	async requestCustomBreak(dto: RequestCustomBreakDto, req: AppRequest, res: Response) {
		return this.makeTransaction({
			action: async (session) => {
				const config = await this.findOne({
					filter: { branch: req.user.currentOrganization.branch },
					custom: this.customBreakConfigModel,
				});
				const { fieldValues, proposedHour } = dto;
				await this.commonService.checkFormField(config.form, fieldValues);
				return await this.create({ dto: { proposedHour, form: fieldValues }, session });
			},
			req,
			res,
			audit: { name: 'request-custombreak', module: EModule.Break, payload: dto },
		});
	}
}
