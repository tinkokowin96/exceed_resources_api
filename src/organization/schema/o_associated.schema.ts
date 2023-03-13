import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { WorkingHourType } from 'src/common/util/schema.type';
import { OUserLate } from 'src/late/schema/o_user_late.schema';
import { OUserLeave } from 'src/leave/schema/o_user_leave.schema';
import { OUserOvertime } from 'src/overtime/schema/o_user_overtime';
import { Permission } from 'src/permission/permission.schema';
import { Break } from './break.schema';
import { Department } from './department.schema';
import { Organization } from './organization.schema';
import { Position } from './position.schema';

//NOTE: flexibleworkinghour, checkin, checkout and break will null for non custom(use value from config)
@Schema()
export class OAssociated extends CoreSchema {
  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  superAdmin: boolean;

  @Prop({ type: Boolean })
  @IsBoolean()
  flexibleWorkingHour: boolean;

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @ValidateNested()
  @Type(() => WorkingHourType)
  checkInTime: WorkingHourType;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @ValidateNested()
  @Type(() => WorkingHourType)
  checkOutTime: WorkingHourType;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  organization: Organization;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Position' })
  position: Position;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Permission' })
  permission: Permission;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Break' }] })
  breaks: Break[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Department' }] })
  departments: Department[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'OUserLate' }] })
  lates: OUserLate[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'OUserOvertime' }] })
  overtimes: OUserOvertime[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'OUserLeave' }] })
  leaves: OUserLeave[];
}

export const OAssociatedSchema = SchemaFactory.createForClass(OAssociated);
