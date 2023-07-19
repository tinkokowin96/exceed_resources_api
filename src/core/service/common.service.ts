import { Injectable } from '@nestjs/common';
import { CoreService } from './core.service';
import { Field } from '../schema/field.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class CommonService extends CoreService<Field> {
	constructor(
		@InjectConnection() connection: Connection,
		@InjectModel(Field.name) model: Model<Field>,
	) {
		super(connection, model);
	}
}
