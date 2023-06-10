import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription } from 'rxjs';
import { CuponModule } from '../cupon/cupon.module';
import { Promotion, PromotionSchema } from '../promotion/promotion.schema';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionSchema } from './subscription.schema';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Promotion.name, schema: PromotionSchema },
    ]),
    CuponModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
