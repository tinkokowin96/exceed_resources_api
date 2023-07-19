import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Model } from 'mongoose';
import { Branch } from 'src/branch/branch.schema';
import { CoreService } from 'src/core/service/core.service';
import { EModule } from 'src/core/util/enumn';
import { AppRequest } from 'src/core/util/type';
import { CreateBreakDto } from '../dto/break.dto';
import { Break } from '../schema/break.schema';

@Injectable()
export class BreakService extends CoreService<Break> {
	constructor(
		@InjectConnection() connection: Connection,
		@InjectModel(Break.name) model: Model<Break>,
		@InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
	) {
		super(connection, model);
	}

	async createBreak(dto: CreateBreakDto, req: AppRequest, res: Response) {
		return this.makeTransaction({
			action: async (session) => {
				const { branchId, ...payload } = dto;
				const branch = await this.findById({
					id: branchId,
					custom: this.branchModel,
				});
				return await this.create({ dto: { ...payload, branch }, session });
			},
			req,
			res,
			audit: { name: 'create-break', module: EModule.Break, payload: dto },
		});
	}
}
