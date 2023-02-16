import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import * as cookieParser from 'cookie-parser';
import { ExceedLimit, ExceedLimitSchema } from 'src/common/schema/exceed_limit.schema';
import { ErConfig, ErConfigSchema } from 'src/er_app/schema/er_config.schema';
import { ErUser, ErUserSchema } from 'src/er_app/schema/er_user.schema';
import { OConfig, OConfigSchema } from 'src/organization/schema/o_config.schema';
import { OSubscription, OSubscriptionSchema } from 'src/organization/schema/o_subscription.schema';
import { OUser, OUserSchema } from 'src/o_user/schema/o_user.schema';
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
      { name: ErUser.name, schema: ErUserSchema },
      { name: OUser.name, schema: OUserSchema },
      { name: OSubscription.name, schema: OSubscriptionSchema },
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
