import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import * as cookieParser from 'cookie-parser';
import { ExceedLimit, ExceedLimitSchema } from 'src/common/schema/exceed_limit.schema';
import { ErConfig, ErConfigSchema } from 'src/er_app/schema/er_config.schema';
import { OConfig, OConfigSchema } from 'src/organization/schema/o_config.schema';
import { Permission, PermissionSchema } from 'src/permission/permission.schema';
import { AuthGuard } from './auth.guard';
import { CustomThrottleGuard } from './custom_throttle.guard';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 2,
      // limit: 10,
      // limit: 5,
    }),
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
      { name: ErConfig.name, schema: ErConfigSchema },
      { name: OConfig.name, schema: OConfigSchema },
      { name: ExceedLimit.name, schema: ExceedLimitSchema },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottleGuard,
    },
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
