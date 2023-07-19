import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { intersection } from 'lodash';
import { Connection, Model } from 'mongoose';
import { CoreService } from 'src/core/service/core.service';
import { EModule } from 'src/core/util/enumn';
import { AppRequest, TriggeredBy } from 'src/core/util/type';
import { CreatePositionDto, UpdatePositionDto } from './position.dto';
import { Position } from './position.schema';
import { OConfig } from 'src/organization/schema/o_config.schema';

@Injectable()
export class PositionService extends CoreService<Position> {
	constructor(
		@InjectConnection() connection: Connection,
		@InjectModel(Position.name) model: Model<Position>,
		@InjectModel(OConfig.name) private readonly configModel: Model<OConfig>,
	) {
		super(connection, model);
	}

	async createPosition(
		dto: CreatePositionDto,
		req: AppRequest,
		res: Response,
		trigger?: TriggeredBy,
	) {
		return this.makeTransaction({
			session: trigger?.session,
			action: async (session) => {
				const { configId, ...payload } = dto;
				let config: OConfig;
				if (req.user) {
					config = req.config as OConfig;
					const includeRestricted = intersection(
						req.config.restrictedRoutes,
						dto.allowedRoutes,
					);
					if (includeRestricted.length)
						throw new BadRequestException('Include restricted permissions');
				} else if (!configId) throw new BadRequestException('Config is required');
				config = await this.findById({ id: configId, custom: this.configModel });

				return await this.create({ dto: { ...payload, config }, session });
			},
			req,
			res: trigger ? undefined : res,
			audit: {
				name: 'create-position',
				module: EModule.Position,
				payload: dto,
				triggeredBy: trigger?.service,
			},
		});
	}

	async updatePosition(dto: UpdatePositionDto, req: AppRequest, res: Response) {
		return this.makeTransaction({
			action: async (session) => {
				const { id, breakIds, configId, ...payload } = dto;
				let config;
				const addBreaks = [];
				const removeBreaks = [];
				if (breakIds)
					breakIds.forEach((each) =>
						each.add ? addBreaks.push(each.value) : removeBreaks.push(each.value),
					);

				if (configId)
					config = await this.findById({ id: configId, custom: this.configModel });

				return await this.findAndUpdate({
					id,
					update: {
						$set: {
							...payload,
							config,
							breaks: {
								$pop: removeBreaks,
								$push: addBreaks,
							},
						},
					},
					session,
				});
			},
			req,
			res,
			audit: { name: 'update-position', module: EModule.Position, payload: dto },
		});
	}
}
