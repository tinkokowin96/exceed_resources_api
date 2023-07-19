import { BadRequestException, Injectable } from '@nestjs/common';
import { CoreService } from 'src/core/service/core.service';
import { Branch } from './branch.schema';
import { CreateBranchDto } from './branch.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Organization } from 'src/organization/schema/organization.schema';
import { AppRequest, TriggeredBy } from 'src/core/util/type';
import { Response } from 'express';
import { EModule } from 'src/core/util/enumn';
import { omit } from 'lodash';
import { OConfig } from 'src/organization/schema/o_config.schema';

@Injectable()
export class BranchService extends CoreService<Branch> {
	constructor(
		@InjectConnection() connection: Connection,
		@InjectModel(Branch.name) model: Model<Branch>,
		@InjectModel(Organization.name) private readonly organizationModel: Model<Organization>,
		@InjectModel(OConfig.name) private readonly configModel: Model<OConfig>,
	) {
		super(connection, model);
	}

	async createBranch(
		dto: CreateBranchDto,
		req: AppRequest,
		res: Response,
		trigger?: TriggeredBy,
	) {
		return this.makeTransaction({
			session: trigger?.session,
			action: async (session) => {
				const { organizationId, configId, ...payload } = omit(dto, ['organization']);
				let organization = dto.organization;
				if (!organization && !organizationId)
					throw new BadRequestException('Organization is required');
				if (organizationId)
					organization = await this.findById({
						id: organizationId,
						custom: this.organizationModel,
						options: { populate: 'config' },
					});
				let config = organization.config;

				if (configId)
					config = await this.findById({ id: configId, custom: this.configModel });

				return await this.create({ dto: { ...payload, organization, config }, session });
			},
			req,
			res,
			audit: {
				name: 'create-branch',
				module: EModule.Branch,
				payload: dto,
				triggeredBy: trigger?.service,
			},
		});
	}
}
