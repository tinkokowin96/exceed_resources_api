import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from 'src/organization/schema/organization.schema';
import { CuponModule } from '../cupon/cupon.module';
import { SubscriptionRequest, SubscriptionRequestSchema } from './schema/subscription_request.schema';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from 'rxjs';
import { SubscriptionSchema } from './schema/subscription.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: SubscriptionRequest.name, schema: SubscriptionRequestSchema },
      { name: Organization.name, schema: OrganizationSchema },
    ]),
    CuponModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
