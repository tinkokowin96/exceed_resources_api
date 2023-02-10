import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OAdminUserBank, OAdminUserBankSchema } from 'src/bank/schema/o_admin_user_bank.schema';
import { OUserBank, OUserBankSchema } from 'src/bank/schema/o_user_bank.schema';
import { Organization, OrganizationSchema } from 'src/organization/schema/organization.schema';
import { Project, ProjectSchema } from 'src/project/schema/project.schema';
import { OUserController } from './controller/o_user.controller';
import { OUser, OUserSchema } from './schema/o_user.schema';
import { OUserService } from './service/o_user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OUser.name, schema: OUserSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: OUserBank.name, schema: OUserBankSchema },
      { name: OAdminUserBank.name, schema: OAdminUserBankSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
  controllers: [OUserController],
  providers: [OUserService],
})
export class OUserModule {}
