import { AppOmitWithExtra } from 'src/core/dto/core.dto';
import { Break } from '../schema/break.schema';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBreakDto extends AppOmitWithExtra(Break, ['branch']) {
  @IsNotEmpty()
  @IsString()
  branchId: string;
}
