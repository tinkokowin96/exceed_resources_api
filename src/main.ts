import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { scheduleJob } from 'node-schedule';
import { AppModule } from './app.module';
import { ExtraSalaryService } from './salary/service/extra_salary.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, skipMissingProperties: true }));
  app.use(helmet());
  const extraSalaryService = app.get(ExtraSalaryService);
  scheduleJob('0 21 * * *', () =>
    extraSalaryService.approveExtraSalary({ late: true }, null, null, { service: 'penalize-late' }),
  );
  await app.listen(4000);
}
bootstrap();
