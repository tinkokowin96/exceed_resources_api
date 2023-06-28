import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from 'src/branch/branch.schema';
import { Department, DepartmentSchema } from 'src/department/department.schema';
import { Leave, LeaveSchema } from 'src/leave/schema/leave.schema';
import { PositionModule } from 'src/position/position.module';
import { Position, PositionSchema } from 'src/position/position.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { OAssociated, OAssociatedSchema } from './schema/o_associated.schema';
import { OAssociatedService } from './service/o_associated.service';
import { OAssociatedController } from './controller/o_associated.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OAssociated.name, schema: OAssociatedSchema },
      { name: User.name, schema: UserSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Position.name, schema: PositionSchema },
      { name: Department.name, schema: DepartmentSchema },
      { name: Leave.name, schema: LeaveSchema },
    ]),
    PositionModule,
  ],
  controllers: [OAssociatedController],
  providers: [OAssociatedService],
})
export class OAssociatedModule {}
