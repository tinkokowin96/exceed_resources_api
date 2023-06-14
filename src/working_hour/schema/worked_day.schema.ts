import { Prop, Schema } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Break } from 'src/break/schema/break.schema';
import { UserBreak } from 'src/break/schema/user_break.schema';
import { Counter, Hour } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { User } from 'src/user/schema/user.schema';
import { UserOvertime } from 'src/user_overtime/user_overtime';

class BreakWorkingHour {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Counter)
  breakTime: Counter;

  @IsNotEmpty()
  @IsMongoId()
  break: Break;
}

@Schema()
export class WorkedDay extends CoreSchema {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Hour)
  checkInTime: Hour;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Hour)
  checkOutTime: Hour;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BreakWorkingHour)
  breaks: BreakWorkingHour[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'UserBreak' })
  userBreak?: UserBreak;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'UserOvertime' })
  overtime?: UserOvertime;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  lateApprovedBy?: User;
}
