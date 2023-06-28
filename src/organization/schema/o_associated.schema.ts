import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Branch } from 'src/branch/branch.schema';
import { Hour } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Department } from 'src/department/department.schema';
import { LeaveAllowed } from 'src/leave/schema/leave.schema';
import { Position } from 'src/position/position.schema';

//NOTE: flexibleworkinghour, checkin, checkout and break will null for non custom(use value from config)
export class OAssociated extends CoreSchema {
  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  basicSalary: number;

  @Prop({ type: Boolean, required: true })
  @IsNotEmpty()
  @IsBoolean()
  accessOAdminApp: boolean;

  @Prop({ type: Number })
  @IsNumber()
  numPoint: number;

  @Prop({ type: String })
  @IsString()
  remark?: string;

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested()
  @Type(() => Hour)
  checkInTime?: Hour;

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested()
  @Type(() => Hour)
  checkOutTime?: Hour;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Branch' })
  @IsNotEmpty()
  branch: Branch;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Position' })
  @IsNotEmpty()
  position: Position;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Department' }] })
  departments: Department[];

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => LeaveAllowed)
  leaves?: LeaveAllowed[];
}

export const OAssociatedSchema = SchemaFactory.createForClass(OAssociated);
