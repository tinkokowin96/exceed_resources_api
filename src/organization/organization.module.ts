import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/category/category.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Branch, BranchSchema } from 'src/branch/branch.schema';
import { Department, DepartmentSchema } from 'src/department/department.schema';
import { Leave, LeaveSchema } from 'src/leave/schema/leave.schema';
import { Position, PositionSchema } from 'src/position/position.schema';
import { OAssociated, OAssociatedSchema } from './schema/o_associated.schema';
import { OrganizationController } from './controller/organization.controller';
import { OConfig, OConfigSchema } from './schema/o_config.schema';
import { Organization, OrganizationSchema } from './schema/organization.schema';
import { OrganizationService } from './service/organization.service';
import { OAssociatedController } from './controller/o_associated.controller';
import { OAssociatedService } from './service/o_associated.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      //organization
      { name: Organization.name, schema: OrganizationSchema },
      { name: Category.name, schema: CategorySchema },
      { name: OConfig.name, schema: OConfigSchema },
      { name: User.name, schema: UserSchema },
      //oassociated
      { name: OAssociated.name, schema: OAssociatedSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Position.name, schema: PositionSchema },
      { name: Department.name, schema: DepartmentSchema },
      { name: Leave.name, schema: LeaveSchema },
    ]),
  ],
  controllers: [OrganizationController, OAssociatedController],
  providers: [OrganizationService, OAssociatedService],
  exports: [OAssociatedService],
})
export class OrganizationModule {}
