import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Connection, Model } from 'mongoose';
import { Department } from 'src/department/department.schema';
import { Position } from 'src/position/position.schema';
import { User } from 'src/user/schema/user.schema';
import { FieldValue } from '../schema/common.schema';
import { Field } from '../schema/field.schema';
import { EField } from '../util/enumn';
import { CoreService } from './core.service';

@Injectable()
export class CommonService extends CoreService<Field> {
	constructor(
		@InjectConnection() connection: Connection,
		@InjectModel(Field.name) model: Model<Field>,
		@InjectModel(User.name) private readonly userModel: Model<User>,
		@InjectModel(Department.name) private readonly departmentModel: Model<Department>,
		@InjectModel(Position.name) private readonly positionModel: Model<Position>,
	) {
		super(connection, model);
	}

	async checkFormField(form: Field[], fieldValues: FieldValue[]) {
		if (fieldValues.length > form.length) throw new BadRequestException('Invalid field values');
		const fieldArray = [...form];

		for (const { id, type, value } of fieldValues) {
			fieldArray.filter(({ _id }) => _id.equals(id));
			const fieldValue = Array.isArray(value) ? value : [value];

			switch (type) {
				case EField.User:
					const users = (
						await this.find({
							filter: { _id: { $in: fieldValue } },
							custom: this.userModel,
						})
					).items;
					if (users.length !== fieldValue.length)
						throw new BadRequestException('User not found');
					break;

				case EField.Department:
					const departments = (
						await this.find({
							filter: { _id: { $in: fieldValue } },
							custom: this.departmentModel,
						})
					).items;
					if (departments.length !== fieldValue.length)
						throw new BadRequestException('Department not found');
					break;

				case EField.Position:
					const positions = (
						await this.find({
							filter: { _id: { $in: fieldValue } },
							custom: this.positionModel,
						})
					).items;
					if (positions.length !== fieldValue.length)
						throw new BadRequestException('Position not found');
					break;

				default:
					fieldValue.forEach((each) => {
						if (type === EField.Date) {
							const date = dayjs(each);
							if (!date.isValid())
								throw new BadRequestException('Not a valid date string');
						} else if (type === EField.Number) {
							if (typeof each !== 'number')
								throw new BadRequestException('Not a number');
						} else {
							const regex = /[^a-zA-Z0-9\s_]/g;
							if (regex.test(each))
								throw new BadRequestException('Include invalid characters');
						}
					});
					break;
			}
		}

		if (fieldArray.length) {
			const fields = (await this.find({ filter: { _id: fieldArray, mandatory: true } }))
				.items;
			if (fields.length) throw new BadRequestException('Missing mandatory fields');
		}
	}

	// async compensateExtraSalary(
	// 	{ amount, compensations, earning, category }: CompensateExtraSalaryDto,
	// 	req: AppRequest,
	// 	res: Response,
	// 	triggeredBy: TriggeredBy,
	// ) {
	// 	const compensation = compensations[getNestedIndex(compensations, 'amount', amount)];
	// 	if (compensation) {
	// 		return await this.extraSalaryService.createExtraSalary(
	// 			{ earning, extra: compensation, category },
	// 			req,
	// 			res,
	// 			triggeredBy,
	// 		);
	// 	}
	// }
}
