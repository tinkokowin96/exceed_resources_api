import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from 'src/organization/schema/organization.schema';
import { CuponModule } from '../cupon/cupon.module';
import { OSubscription, OSubscriptionSchema } from './o_subscription.schema';
import { SubscriptionController } from './o_subscription.controller';
import { SubscriptionService } from './o_subscription.service';
import { Subscription } from 'rxjs';
import { SubscriptionSchema } from './schema/subscription.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: OSubscription.name, schema: OSubscriptionSchema },
      { name: Organization.name, schema: OrganizationSchema },
    ]),
    CuponModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
