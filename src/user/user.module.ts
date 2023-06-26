import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bank, BankSchema } from 'src/bank/bank.schema';
import { DepartmentModule } from 'src/department/department.module';
import { Department, DepartmentSchema } from 'src/department/department.schema';
import { Leave, LeaveSchema } from 'src/leave/schema/leave.schema';
import { OSubscription, OSubscriptionSchema } from 'src/o_subscription/o_subscription.schema';
import { OConfig, OConfigSchema } from 'src/organization/schema/o_config.schema';
import { Organization, OrganizationSchema } from 'src/organization/schema/organization.schema';
import { PositionModule } from 'src/position/position.module';
import { Position, PositionSchema } from 'src/position/position.schema';
import { User, UserSchema } from './schema/user.schema';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: OConfig.name, schema: OConfigSchema },
      { name: Bank.name, schema: BankSchema },
      { name: Leave.name, schema: LeaveSchema },
      { name: Department.name, schema: DepartmentSchema },
      { name: OSubscription.name, schema: OSubscriptionSchema },
      { name: Position.name, schema: PositionSchema },
    ]),
    DepartmentModule,
    PositionModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
