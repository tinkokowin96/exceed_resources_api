import { Global, Module } from '@nestjs/common';
import { createConnection } from 'mongoose';
import { Audit, AuditSchema } from './schema/audit.schema';
import { AUDIT_MODEL } from './util/constant';
import { ScheduledJobService } from './service/scheduled_jobs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ExtraSalary, ExtraSalarySchema } from 'src/extra_salary/extra_salary.schema';

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
    ScheduledJobService,
  ],
  exports: [AUDIT_MODEL, ScheduledJobService],
})
export class CommonModule {}
