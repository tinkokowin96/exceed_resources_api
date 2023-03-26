import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bank, BankSchema } from 'src/bank/schema/bank.schema';
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
      { name: Bank.name, schema: BankSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
  controllers: [OUserController],
  providers: [OUserService],
  exports: [OUserService],
})
export class OUserModule {}
