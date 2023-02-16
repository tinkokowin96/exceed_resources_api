import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bank, BankSchema } from 'src/bank/schema/bank.schema';
import { Permission, PermissionSchema } from 'src/permission/permission.schema';
import { ErUserController } from './controller/er_user.controller';
import { ErUser, ErUserSchema } from './schema/er_user.schema';
import { ErUserService } from './service/er_user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ErUser.name, schema: ErUserSchema },
      { name: Bank.name, schema: BankSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [ErUserController],
  providers: [ErUserService],
})
export class ErAppModule {}
