import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExtraSalary, ExtraSalarySchema } from './schema/extra_salary.schema';
import { PointTransaction, PointTransactionSchema } from 'src/point_transaction/point_transaction.schema';
import { ExtraSalaryService } from './service/extra_salary.service';
import { ExtraSalaryController } from './controller/extra_salary.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExtraSalary.name, schema: ExtraSalarySchema },
      { name: PointTransaction.name, schema: PointTransactionSchema },
    ]),
  ],
  controllers: [ExtraSalaryController],
  providers: [ExtraSalaryService],
  exports: [ExtraSalaryService],
})
export class SalaryModule {}
