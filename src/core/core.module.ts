import { Global, Module } from '@nestjs/common';
import { createConnection } from 'mongoose';
import { Audit, AuditSchema } from './schema/audit.schema';
import { AUDIT_MODEL } from './util/constant';
import { MongooseModule } from '@nestjs/mongoose';
import { ExtraSalary, ExtraSalarySchema } from 'src/salary/schema/extra_salary.schema';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: ExtraSalary.name, schema: ExtraSalarySchema }])],
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
