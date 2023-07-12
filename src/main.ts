import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { scheduleJob } from 'node-schedule';
import { AppModule } from './app.module';
import { CommonService } from './common/service/common.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, skipMissingProperties: true }));
  app.use(helmet());
  const scheduleService = app.get(CommonService);
  scheduleJob('0 21 * * *', scheduleService.approveExtraSalary);
  await app.listen(4000);
  // scheduleJob(new Date(2023, 1, 16, 12, 47), () => {
  //   console.log('job running.....');
  // });
}
bootstrap();
