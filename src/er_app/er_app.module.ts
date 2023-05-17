import { Module } from '@nestjs/common';
import { CuponModule } from './cupon/cupon.module';
import { ErUserModule } from './er_user/er_user.module';
import { PromotionModule } from './promotion/promotion.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [CuponModule, ErUserModule, PromotionModule, SubscriptionModule],
})
export class ErAppModule {}
