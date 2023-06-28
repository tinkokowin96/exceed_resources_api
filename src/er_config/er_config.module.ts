import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ErConfig, ErConfigSchema } from './schema/er_config.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Currency, CurrencySchema } from './schema/currency.schema';
import { ErConfigController } from './controller/er_config.controller';
import { ErConfigService } from './service/er_config.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ErConfig.name, schema: ErConfigSchema },
      { name: User.name, schema: UserSchema },
      { name: Currency.name, schema: CurrencySchema },
    ]),
  ],
  controllers: [ErConfigController],
  providers: [ErConfigService],
})
export class ErConfigModule {}
