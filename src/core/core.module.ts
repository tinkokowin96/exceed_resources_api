import { Global, Module } from '@nestjs/common';
import { createConnection } from 'mongoose';
import { Audit, AuditSchema } from './schema/audit.schema';
import { AUDIT_MODEL } from './util/constant';
import { MongooseModule } from '@nestjs/mongoose';
import { ExtraSalary, ExtraSalarySchema } from 'src/salary/schema/extra_salary.schema';
import { Field, FieldSchema } from './schema/field.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Department, DepartmentSchema } from 'src/department/department.schema';
import { Position, PositionSchema } from 'src/position/position.schema';

@Global()
@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: ExtraSalary.name, schema: ExtraSalarySchema },
			{ name: Field.name, schema: FieldSchema },
			{ name: User.name, schema: UserSchema },
			{ name: Department.name, schema: DepartmentSchema },
			{ name: Position.name, schema: PositionSchema },
		]),
	],
	providers: [
		{
			provide: AUDIT_MODEL,
			useFactory: () => {
				const connection = createConnection(process.env.MONGODB_URI);
				return connection.model(Audit.name, AuditSchema);
			},
		},
	],
	exports: [AUDIT_MODEL],
})
export class CoreModule {}
