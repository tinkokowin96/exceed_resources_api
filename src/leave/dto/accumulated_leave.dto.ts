import { AppOmit } from 'src/common/dto/core.dto';
import { AccumulatedLeave } from '../schema/accumulated_leave.schema';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAccumulatedLeaveDto extends AppOmit(AccumulatedLeave, [
  'year',
  'leave',
  'grantedBy',
  'availableDay',
  'isUsed',
]) {
  @IsNotEmpty()
  @IsString()
  leaveId: string;

  @IsString()
  grantedUserId?: string;
}
