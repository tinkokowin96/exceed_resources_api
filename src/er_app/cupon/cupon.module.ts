import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CuponCode, CuponCodeSchema } from './schema/cupon_code.schema';
import { CuponController } from './cupon.controller';
import { CuponService } from './cupon.service';
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
  exports: [CuponService],
})
export class CuponModule {}
