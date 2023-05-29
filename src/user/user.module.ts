import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bank, BankSchema } from 'src/bank/schema/bank.schema';
import { Break, BreakSchema } from 'src/break/schema/break.schema';
import { DepartmentModule } from 'src/department/department.module';
import { Department, DepartmentSchema } from 'src/department/schema/department.schema';
import { OConfig, OConfigSchema } from 'src/organization/schema/o_config.schema';
import { Organization, OrganizationSchema } from 'src/organization/schema/organization.schema';
import { PositionModule } from 'src/position/position.module';
import { User, UserSchema } from './schema/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: OConfig.name, schema: OConfigSchema },
      { name: Bank.name, schema: BankSchema },
      { name: Break.name, schema: BreakSchema },
      { name: Department.name, schema: DepartmentSchema },
    ]),
    DepartmentModule,
    PositionModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
