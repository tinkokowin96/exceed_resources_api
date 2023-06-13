import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription } from 'rxjs';
import { Category, CategorySchema } from 'src/category/category.schema';
import { SubscriptionSchema } from 'src/subscription/subscription.schema';
import { Organization, OrganizationSchema } from 'src/organization/schema/organization.schema';
import { OSubscription, OSubscriptionSchema } from './o_subscription.schema';
import { OSubscriptionService } from './o_subscription.service';
import { Promotion, PromotionSchema } from 'src/promotion/promotion.schema';
import { OSubscriptionController } from './o_subscription.controller';
import { CuponCode, CuponCodeSchema } from 'src/cupon/schema/cupon_code.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: OSubscription.name, schema: OSubscriptionSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Promotion.name, schema: PromotionSchema },
      { name: CuponCode.name, schema: CuponCodeSchema },
    ]),
  ],
  controllers: [OSubscriptionController],
  providers: [OSubscriptionService],
})
export class OSubscriptionModule {}
