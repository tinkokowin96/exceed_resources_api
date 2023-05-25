import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bank, BankSchema } from 'src/bank/schema/bank.schema';
import { Organization, OrganizationSchema } from 'src/organization/schema/organization.schema';
import { Project, ProjectSchema } from 'src/project/schema/project.schema';
import { UserController } from './user.controller';
import { User, UserSchema } from './schema/user.schema';
import { UserService } from './user.service';
import { DepartmentModule } from 'src/department/department.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: Bank.name, schema: BankSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
    DepartmentModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
