import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BreakController } from './controller/break.controller';
import { BreakService } from './service/break.service';
import { Break, BreakSchema } from './schema/break.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Break.name, schema: BreakSchema }])],
  controllers: [BreakController],
  providers: [BreakService],
})
export class BreakModule {}
