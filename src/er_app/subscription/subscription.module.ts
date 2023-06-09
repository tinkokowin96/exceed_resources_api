import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from 'src/organization/schema/organization.schema';
import { CuponModule } from '../cupon/cupon.module';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from 'rxjs';
import { SubscriptionSchema } from './subscription.schema';
import { OSubscription, OSubscriptionSchema } from 'src/o_subscription/o_subscription.schema';

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
