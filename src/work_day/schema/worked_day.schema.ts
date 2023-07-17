import { Prop, Schema } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsDateString, IsMongoId, IsNotEmpty, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Break } from 'src/break/schema/break.schema';
import { CustomBreak } from 'src/break/schema/custom_break.schema';
import { Counter } from 'src/core/schema/common.schema';
import { CoreSchema } from 'src/core/schema/core.shema';
import { Overtime } from 'src/overtime/overtime.schema';
import { ExtraSalary } from 'src/salary/schema/extra_salary.schema';
import { User } from 'src/user/schema/user.schema';

class UtilizedBreak {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Counter)
  breakTime: Counter;

  @IsNotEmpty()
  @IsMongoId()
  break: Break;

  @IsMongoId()
  latePenalty?: ExtraSalary;
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

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested({ each: true })
  @Type(() => UtilizedBreak)
  breaks?: UtilizedBreak[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'ExtraSalary' })
  latePenalty?: ExtraSalary;

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
