import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from './branch.schema';
import { Organization, OrganizationSchema } from 'src/organization/schema/organization.schema';
import { OConfig, OConfigSchema } from 'src/organization/schema/o_config.schema';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Branch.name, schema: BranchSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: OConfig.name, schema: OConfigSchema },
    ]),
  ],
  controllers: [BranchController],
  providers: [BranchService],
  exports: [BranchService],
})
export class BranchModule {}
