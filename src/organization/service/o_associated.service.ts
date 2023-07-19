import { BadRequestException, Injectable } from '@nestjs/common';
import { CoreService } from 'src/core/service/core.service';
import { OAssociated } from '../schema/o_associated.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateOAssociatedDto } from '../dto/o_associated.dto';
import { AppRequest, TriggeredBy } from 'src/core/util/type';
import { Response } from 'express';
import { EModule } from 'src/core/util/enumn';
import { Branch } from 'src/branch/branch.schema';
import { Position } from 'src/position/position.schema';
import { Department } from 'src/department/department.schema';
import { Leave } from 'src/leave/schema/leave.schema';
import { PositionService } from 'src/position/position.service';
import { Organization } from '../schema/organization.schema';
import { OConfig } from '../schema/o_config.schema';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class OAssociatedService extends CoreService<OAssociated> {
	constructor(
		@InjectConnection() connection: Connection,
		@InjectModel(OAssociated.name) model: Model<OAssociated>,
		@InjectModel(User.name) private readonly userModel: Model<User>,
		@InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
		@InjectModel(Position.name) private readonly positionModel: Model<Position>,
		@InjectModel(Department.name) private readonly departmentModel: Model<Department>,
		@InjectModel(Leave.name) private readonly leaveModel: Model<Leave>,
		private readonly positionService: PositionService,
	) {
		super(connection, model);
	}

	async createOAssociated(
		dto: CreateOAssociatedDto,
		req: AppRequest,
		res: Response,
		trigger?: TriggeredBy,
	) {
		return this.makeTransaction({
			session: trigger?.session,
			action: async (session) => {
				const { branchId, positionId, departmentIds, leaveAllowed, configId, ...payload } =
					dto;

				let branch: Branch, position, departments;
				if (req.user) branch = req.user.currentOrganization.branch;
				else {
					if (!branchId) throw new BadRequestException('Branch is required');
					branch = await this.findById({
						id: branchId,
						custom: this.branchModel,
						options: {
							populate: [
								{
									path: 'organization',
									model: Organization.name,
									select: ['name'],
								},
								{
									path: 'config',
									model: OConfig.name,
									select: ['_id'],
								},
							],
						},
					});
				}
				if (positionId)
					position = await this.findById({ id: positionId, custom: this.positionModel });
				else {
					if (req.user) throw new BadRequestException('Position is required');
					else {
						const user = await this.findOne({
							filter: {
								'currentOrganization.branch.organization._id':
									branch.organization._id,
							},
							custom: this.userModel,
							options: {
								populate: [
									{
										path: 'currentOrganization',
										model: OAssociated.name,
										select: ['branch'],
										populate: [
											{
												path: 'branch',
												model: Branch.name,
												select: ['organization'],
												populate: [
													{
														path: 'organization',
														model: Organization.name,
														select: ['_id'],
													},
												],
											},
										],
									},
								],
							},
						});
						if (user) throw new BadRequestException('Organization already had owner');

						position = await this.positionService.createPosition(
							{
								name: `${branch.organization.name} Owner`,
								shortName: 'Owner',
								basicSalary: 0,
								configId: configId ?? branch.config._id.toString(),
							},
							req,
							res,
							{ session, service: 'create-oassociated' },
						);
					}
				}

				if (departmentIds) {
					departments = (
						await this.find({
							filter: { _id: { $in: departmentIds } },
							custom: this.departmentModel,
						})
					).items;
				}

				let leaves = position.config.leaves;
				if (leaveAllowed) {
					const arr = [];
					const leaveArr = await this.find({
						filter: { _id: { $in: leaveAllowed.map((each) => each.leaveId) } },
						custom: this.leaveModel,
						options: { projection: { _id: 1 } },
					});
					leaveArr.items.forEach((each) => {
						const leave = leaveAllowed.find((lev) => each.id === lev.leaveId);
						if (leave) arr.push({ numAllowed: leave.numAllowed, leave: each._id });
					});
					leaves = arr;
				}
				return await this.create({
					dto: { ...payload, branch, position, departments, leaves },
					session,
				});
			},
			req,
			res,
			audit: {
				name: 'create-oassociated',
				module: EModule.User,
				payload: dto,
				triggeredBy: trigger?.service,
			},
		});
	}
}
