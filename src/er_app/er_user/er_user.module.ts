import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bank, BankSchema } from 'src/bank/schema/bank.schema';
import { Permission, PermissionSchema } from 'src/permission/permission.schema';
import { ErUserController } from './er_user.controller';
import { ErUser, ErUserSchema } from './schema/er_user.schema';
import { ErUserService } from './er_user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ErUser.name, schema: ErUserSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Bank.name, schema: BankSchema },
    ]),
  ],
  controllers: [ErUserController],
  providers: [ErUserService],
})
export class ErUserModule {}
