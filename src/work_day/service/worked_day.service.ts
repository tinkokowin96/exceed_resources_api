import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import { Response } from 'express';
import { Connection, Model, Types } from 'mongoose';
import { Break } from 'src/break/schema/break.schema';
import { Location } from 'src/core/schema/common.schema';
import { CoreService } from 'src/core/service/core.service';
import { getWeekDay } from 'src/core/util/date_time';
import { EModule } from 'src/core/util/enumn';
import { calculateDistance, getNestedIndex } from 'src/core/util/misc';
import { AppRequest } from 'src/core/util/type';
import { OConfig } from 'src/organization/schema/o_config.schema';
import { ExtraSalaryService } from 'src/salary/service/extra_salary.service';
import { CustomWorkDay } from '../schema/custom_work_day.schema';
import { WorkedDay } from '../schema/worked_day.schema';

@Injectable()
export class WorkedDayService extends CoreService<WorkedDay> {
	constructor(
		@InjectConnection() connection: Connection,
		@InjectModel(WorkedDay.name) model: Model<WorkedDay>,
		@InjectModel(CustomWorkDay.name) private readonly customWorkDayModel: Model<CustomWorkDay>,
		@InjectModel(Break.name) private readonly breakModel: Model<Break>,
		private readonly extraSalaryService: ExtraSalaryService,
	) {
		super(connection, model);
		dayjs.extend(objectSupport);
	}

	async getConfig(location: Location, req: AppRequest) {
		const customWorkDay = await this.findOne({
			filter: {
				$and: [
					{ startDate: { $gte: new Date() } },
					{ endDate: { $lte: new Date() } },
					{
						$or: [
							{ acceptedUsers: { $elemMatch: req.user._id } },
							{
								affectedPositions: {
									$elemMatch: req.user.currentOrganization.position,
								},
							},
							{ affectAllUser: true },
						],
					},
				],
			},
			custom: this.customWorkDayModel,
		});

		const config =
			customWorkDay?.config ??
			(req.config as OConfig).workDays.find((each) =>
				each.days.includes(getWeekDay(new Date().getDay())),
			).config;

		if (!config.allowRemote) {
			const distance = calculateDistance(
				location,
				customWorkDay?.location ?? req.user.currentOrganization.branch.location,
			);
			if (distance > (req.config as OConfig).toleranceRangeInMeter)
				throw new BadRequestException('User is not within the range of office');
		}

		return config;
	}

	async checkIn(location: Location, req: AppRequest, res: Response) {
		return this.makeTransaction({
			action: async (session) => {
				let latePenalty;
				const config = await this.getConfig(location, req);

				if (!config.flexibleWorkingHour) {
					const checkinTIme = dayjs({
						hour: config.checkInTime.hour,
						minute: config.checkInTime.minute,
					});
					const dateDiff = dayjs().diff(checkinTIme, 'minutes');

					if (dateDiff > 0) {
						const penalty =
							config.latePenalties[
								getNestedIndex(config.latePenalties, 'amount', dateDiff)
							];
						if (penalty) {
							latePenalty = await this.extraSalaryService.createExtraSalary(
								{ earning: false, extra: penalty, category: { category: 'Late' } },
								req,
								res,
								{
									service: 'check-in',
									session,
								},
							);
						}
					}
				}

				return this.create({ dto: { latePenalty, user: req.user }, session });
			},
			req,
			res,
			audit: { name: 'check-in', module: EModule.WorkingHour, payload: location },
		});
	}

	async checkOut(location: Location, req: AppRequest, res: Response) {
		return this.makeTransaction({
			action: async (session) => {
				let checkoutTime;
				const config = await this.getConfig(location, req);

				if (config.flexibleWorkingHour) {
					const workedDay = await this.findOne({ filter: { createdAt: new Date() } });
					checkoutTime = dayjs(workedDay.createdAt).add(config.numWorkingHour, 'hours');
				}
				if (dayjs().diff(checkoutTime ?? dayjs(config.checkOutTime), 'minutes') < 0)
					throw new BadRequestException("Working time hasn't ended");

				return await this.findAndUpdate({
					filter: { createdAt: new Date() },
					update: { $set: { checkOutTime: new Date() } },
					session,
				});
			},
			req,
			res,
			audit: { name: 'check-out', module: EModule.Salary, payload: location },
		});
	}

	async takeBreak(breakId: string, req: AppRequest, res: Response) {
		return this.makeTransaction({
			action: async (session) => {
				const isBreakAllowed = (
					req.user.currentOrganization.position.breaks as unknown as Types.ObjectId[]
				).some((each) => each.equals(breakId));
				if (!isBreakAllowed) throw new BadRequestException('Break is not allowed');
				const tookBreak = await this.findById({ id: breakId, custom: this.breakModel });
				return await this.findAndUpdate({
					filter: { createdAt: new Date() },
					update: { $push: { breaks: tookBreak } },
					session,
				});
			},
			req,
			res,
			audit: { name: 'take-break', payload: breakId, module: EModule.Break },
		});
	}
}
