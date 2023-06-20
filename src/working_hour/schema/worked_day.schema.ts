import { Prop, Schema } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsDateString, IsMongoId, IsNotEmpty, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Break } from 'src/break/schema/break.schema';
import { CustomBreak } from 'src/break/schema/custom_break.schema';
import { Counter } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { User } from 'src/user/schema/user.schema';
import { Overtime } from 'src/overtime/overtime';
import { LatePenalty } from './work_day_config.schema';

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
  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsDateString()
  checkInTime: Date;

  @Prop({ type: Date })
  @IsDateString()
  checkOutTime?: Date;

  @ValidateNested({ each: true })
  @Type(() => BreakWorkingHour)
  breaks?: BreakWorkingHour[];

  @ValidateNested()
  @Type(() => LatePenalty)
  latePenalty?: LatePenalty;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'CustomBreak' })
  userBreak?: CustomBreak;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Overtime' })
  overtime?: Overtime;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  lateApprovedBy?: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  @IsNotEmpty()
  user: User;
}
