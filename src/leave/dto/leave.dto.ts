import { PickType } from '@nestjs/mapped-types';
import { LeaveAllowed } from '../schema/leave.schema';
import { IsNotEmpty, IsString } from 'class-validator';

export class LeaveAllowedDto extends PickType(LeaveAllowed, ['numAllowed']) {
  @IsNotEmpty()
  @IsString()
  leaveId: string;
}
