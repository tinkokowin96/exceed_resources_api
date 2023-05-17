import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from 'src/organization/schema/organization.schema';
import { CuponModule } from '../cupon/cupon.module';
import {
  AddonSubscriptionRequest,
  AddonSubscriptionRequestSchema,
} from './schema/addon_subscription_request.schema';
import { SubscriptionRequest, SubscriptionRequestSchema } from './schema/subscription_request.schema';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionRequest.name, schema: SubscriptionRequestSchema },
      { name: AddonSubscriptionRequest.name, schema: AddonSubscriptionRequestSchema },
      { name: Organization.name, schema: OrganizationSchema },
    ]),
    CuponModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
