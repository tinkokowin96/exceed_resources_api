import { Injectable } from '@nestjs/common';
import { CoreService } from 'src/core/service/core.service';
import { CustomBreak } from '../schema/custom_break.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class CustromBreakService extends CoreService<CustomBreak> {
	constructor(
		@InjectConnection() connection: Connection,
		@InjectModel(CustomBreak.name) model: Model<CustomBreak>,
	) {
		super(connection, model);
	}

	// async requestCustomBreak() {}
}
