import { Module } from '@nestjs/common';
import { CuponModule } from './cupon/cupon.module';
import { PromotionModule } from './promotion/promotion.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ErConfigModule } from './er_config/er_config.module';

@Module({
  imports: [ErConfigModule, CuponModule, PromotionModule, SubscriptionModule],
})
export class ErAppModule {}
