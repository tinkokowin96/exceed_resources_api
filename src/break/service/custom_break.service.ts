import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { CommonService } from 'src/core/service/common.service';
import { CoreService } from 'src/core/service/core.service';
import { EModule, ERequestStatus } from 'src/core/util/enumn';
import { AppRequest } from 'src/core/util/type';
import { RequestCustomBreakDto } from '../dto/custom_break.dto';
import { CustomBreak } from '../schema/custom_break.schema';
import { CustomBreakConfig } from '../schema/custom_break_config.schema';
import dayjs from 'dayjs';
import { getNestedIndex } from 'src/core/util/misc';
import { ExtraSalaryService } from 'src/salary/service/extra_salary.service';

@Injectable()
export class CustromBreakService extends CoreService<CustomBreak> {
	constructor(
		@InjectConnection() connection: Connection,
		@InjectModel(CustomBreak.name) model: Model<CustomBreak>,
		@InjectModel(CustomBreakConfig.name)
		private readonly customBreakConfigModel: Model<CustomBreakConfig>,
		private readonly commonService: CommonService,
		private readonly extraSalaryService: ExtraSalaryService,
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
				if (config.maxAllowedHour && proposedHour > config.maxAllowedHour)
					throw new BadRequestException('Proposed time is longer than max allowed');
				await this.commonService.checkFormField(config.form, fieldValues);
				return await this.create({ dto: { proposedHour, form: fieldValues }, session });
			},
			req,
			res,
			audit: { name: 'request-custombreak', module: EModule.Break, payload: dto },
		});
	}

	async startCustomBreak(id: string, req: AppRequest, res: Response) {
		return this.makeTransaction({
			action: async (session) => {
				const customBreak = await this.findById({ id });
				if (customBreak.status !== ERequestStatus.Approved)
					throw new BadRequestException("CustomBreak hasn't approved");
				return await this.findAndUpdate({
					id,
					update: { $set: { breakTime: { start: new Date() } } },
					session,
				});
			},
			req,
			res,
			audit: { name: 'start-custombreak', module: EModule.Break, payload: id },
		});
	}

	async endCustomBreak(id: string, req: AppRequest, res: Response) {
		return this.makeTransaction({
			action: async (session) => {
				let latePenalty;
				const customBreak = await this.findById({ id });
				if (customBreak.status !== ERequestStatus.Approved)
					throw new BadRequestException("CustomBreak hasn't approved");
				if (!customBreak.breakTime?.start)
					throw new BadRequestException("CustomBreak hasn't started");
				const config = await this.findOne({
					filter: { branch: req.user.currentOrganization.branch },
					custom: this.customBreakConfigModel,
				});
				const dateDiff = dayjs(customBreak.breakTime.start)
					.add(
						config.maxAllowedHour && !config.penaltizeOnExceedProposed
							? config.maxAllowedHour
							: customBreak.proposedHour,
						'hours',
					)
					.diff(dayjs(), 'minutes');

				if (dateDiff < 0) {
					const penalty =
						config.latePenalties[
							getNestedIndex(config.latePenalties, 'amount', dateDiff)
						];
					if (penalty) {
						latePenalty = await this.extraSalaryService.createExtraSalary(
							{
								earning: false,
								extra: penalty,
								category: { category: 'CustomBreakLate' },
							},
							req,
							res,
							{
								service: 'check-in',
								session,
							},
						);
					}
				}

				return await this.findAndUpdate({
					id,
					update: { $set: { breakTime: { end: new Date() }, latePenalty } },
					session,
				});
			},
			req,
			res,
			audit: { name: 'start-custombreak', module: EModule.Break, payload: id },
		});
	}
}
