import { IsNotEmpty, IsString } from 'class-validator';
import { AppOmitWithExtra } from 'src/common/dto/core.dto';
import { AccumulatedLeave } from '../schema/accumulated_leave.schema';

export class CreateAccumulatedLeaveDto extends AppOmitWithExtra(AccumulatedLeave, [
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
