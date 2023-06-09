import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription } from 'rxjs';
import { Category, CategorySchema } from 'src/category/category.schema';
import { SubscriptionSchema } from 'src/er_app/subscription/subscription.schema';
import { Organization, OrganizationSchema } from 'src/organization/schema/organization.schema';
import { OSubscription, OSubscriptionSchema } from './o_subscription.schema';
import { OSubscriptionService } from './o_subscription.service';
import { Promotion, PromotionSchema } from 'src/er_app/promotion/promotion.schema';
import { CuponCode, CuponCodeSchema } from 'src/er_app/cupon/schema/cupon_code.schema';
import { OSubscriptionController } from './o_subscription.controller';

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
export class SubscriptionModule {}
