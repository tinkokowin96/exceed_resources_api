import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import * as cookieParser from 'cookie-parser';
import { ExceedLimit, ExceedLimitSchema } from 'src/core/schema/exceed_limit.schema';
import { ErConfig, ErConfigSchema } from 'src/er_config/schema/er_config.schema';
import { Organization, OrganizationSchema } from 'src/organization/schema/organization.schema';
import { Position, PositionSchema } from 'src/position/position.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { AuthGuard } from './auth.guard';
import { CustomThrottleGuard } from './custom_throttle.guard';
import { OSubscription, OSubscriptionSchema } from 'src/o_subscription/o_subscription.schema';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 2,
      // limit: 10,
      // limit: 5,
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: OSubscription.name, schema: OSubscriptionSchema },
      { name: ErConfig.name, schema: ErConfigSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: ExceedLimit.name, schema: ExceedLimitSchema },
      { name: Position.name, schema: PositionSchema },
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
