import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccumulatedLeave, AccumulatedLeaveSchema } from './schema/accumulated_leave.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Leave, LeaveSchema } from './schema/leave.schema';
import { AccumulatedLeaveController } from './controller/accumulated_leave.controller';
import { AccumulatedLeaveService } from './service/accumulated_leave.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccumulatedLeave.name, schema: AccumulatedLeaveSchema },
      { name: User.name, schema: UserSchema },
      { name: Leave.name, schema: LeaveSchema },
    ]),
  ],
  controllers: [AccumulatedLeaveController],
  providers: [AccumulatedLeaveService],
  exports: [AccumulatedLeaveService],
})
export class LeaveModule {}
