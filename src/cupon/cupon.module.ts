import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CuponCode, CuponCodeSchema } from './schema/cupon_code.schema';
import { CuponController } from './controller/cupon.controller';
import { CuponService } from './service/cupon.service';
import { Cupon, CuponSchema } from './schema/cupon.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cupon.name, schema: CuponSchema },
      { name: CuponCode.name, schema: CuponCodeSchema },
    ]),
  ],
  controllers: [CuponController],
  providers: [CuponService],
})
export class CuponModule {}
