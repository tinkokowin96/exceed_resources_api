import { Module } from '@nestjs/common';
import { CuponModule } from './cupon/cupon.module';
import { PromotionModule } from './promotion/promotion.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [CuponModule, PromotionModule, SubscriptionModule],
})
export class ErAppModule {}
