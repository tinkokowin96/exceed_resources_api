import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from 'src/organization/schema/organization.schema';
import { CuponModule } from '../cupon/cupon.module';
import { OSubscription, OSubscriptionSchema } from './schema/subscription_request.schema';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from 'rxjs';
import { SubscriptionSchema } from './subscription.schema';

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
