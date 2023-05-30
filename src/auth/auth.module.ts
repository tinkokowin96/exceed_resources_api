import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import * as cookieParser from 'cookie-parser';
import { ExceedLimit, ExceedLimitSchema } from 'src/common/schema/exceed_limit.schema';
import { ErConfig, ErConfigSchema } from 'src/er_app/er_config/schema/er_config.schema';
import {
  AddonSubscription,
  AddonSubscriptionSchema,
} from 'src/er_app/subscription/schema/addon_subscription.schema';
import {
  SubscriptionRequest,
  SubscriptionRequestSchema,
} from 'src/er_app/subscription/schema/subscription_request.schema';
import { Organization, OrganizationSchema } from 'src/organization/schema/organization.schema';
import { Position, PositionSchema } from 'src/position/schema/position.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
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
      { name: User.name, schema: UserSchema },
      { name: SubscriptionRequest.name, schema: SubscriptionRequestSchema },
      { name: AddonSubscription.name, schema: AddonSubscriptionSchema },
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
