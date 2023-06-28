import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bank, BankSchema } from 'src/bank/bank.schema';
import { OSubscription, OSubscriptionSchema } from 'src/o_subscription/o_subscription.schema';
import { OrganizationModule } from 'src/organization/module/organization.module';
import { Organization, OrganizationSchema } from 'src/organization/schema/organization.schema';
import { UserController } from './controller/user.controller';
import { User, UserSchema } from './schema/user.schema';
import { UserService } from './service/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: Bank.name, schema: BankSchema },
      { name: OSubscription.name, schema: OSubscriptionSchema },
    ]),
    OrganizationModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
