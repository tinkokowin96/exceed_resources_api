import { Global, Module } from '@nestjs/common';
import { createConnection } from 'mongoose';
import { Audit, AuditSchema } from './schema/audit.schema';
import { AUDIT_MODEL } from './util/constant';

@Global()
@Module({
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
export class CommonModule {}
