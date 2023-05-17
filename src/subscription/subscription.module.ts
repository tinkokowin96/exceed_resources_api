import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionRequest, SubscriptionRequestSchema } from './schema/subscription_request.schema';
import {
  AddonSubscriptionRequest,
  AddonSubscriptionRequestSchema,
} from './schema/addon_subscription_request.schema';
import { Organization, OrganizationSchema } from 'src/organization/schema/organization.schema';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionRequest.name, schema: SubscriptionRequestSchema },
      { name: AddonSubscriptionRequest.name, schema: AddonSubscriptionRequestSchema },
      { name: Organization.name, schema: OrganizationSchema },
    ]),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
