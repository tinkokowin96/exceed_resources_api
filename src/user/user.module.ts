import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bank, BankSchema } from 'src/bank/schema/bank.schema';
import { Break, BreakSchema } from 'src/break/schema/break.schema';
import { DepartmentModule } from 'src/department/department.module';
import { Organization, OrganizationSchema } from 'src/organization/schema/organization.schema';
import { Permission, PermissionSchema } from 'src/permission/permission.schema';
import { Position, PositionSchema } from 'src/position/schema/position.schema';
import { User, UserSchema } from './schema/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: Bank.name, schema: BankSchema },
      { name: Position.name, schema: PositionSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Break.name, schema: BreakSchema },
    ]),
    DepartmentModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
