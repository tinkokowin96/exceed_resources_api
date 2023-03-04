import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bank, BankSchema } from 'src/bank/schema/bank.schema';
import { Category, CategorySchema } from 'src/category/schema/category.schema';
import { Permission, PermissionSchema } from 'src/permission/permission.schema';
import { CuponController } from './controller/cupon.controller';
import { ErUserController } from './controller/er_user.controller';
import { PromotionController } from './controller/promotion.controller';
import { Cupon, CuponSchema } from './schema/cupon.schema';
import { ErUser, ErUserSchema } from './schema/er_user.schema';
import { Promotion, PromotionSchema } from './schema/promotion.schema';
import { CuponService } from './service/cupon.service';
import { ErUserService } from './service/er_user.service';
import { PromotionService } from './service/promotion.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ErUser.name, schema: ErUserSchema },
      { name: Bank.name, schema: BankSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Promotion.name, schema: PromotionSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Cupon.name, schema: CuponSchema },
    ]),
  ],
  controllers: [ErUserController, PromotionController, CuponController],
  providers: [ErUserService, PromotionService, CuponService],
})
export class ErAppModule {}
