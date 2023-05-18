import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { WorkingHourType } from 'src/common/util/schema.type';
import { UserLate } from 'src/late/schema/o_user_late.schema';
import { UserLeave } from 'src/leave/schema/o_user_leave.schema';
import { UserOvertime } from 'src/overtime/schema/o_user_overtime';
import { Permission } from 'src/permission/permission.schema';
import { Break } from '../../break/schema/break.schema';
import { Department } from '../../department/schema/department.schema';
import { Organization } from './organization.schema';
import { Position } from '../../position/schema/position.schema';

//NOTE: flexibleworkinghour, checkin, checkout and break will null for non custom(use value from config)
@Schema()
export class OAssociated extends CoreSchema {
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

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'UserLate' }] })
  lates: UserLate[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'UserOvertime' }] })
  overtimes: UserOvertime[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'UserLeave' }] })
  leaves: UserLeave[];
}

export const OAssociatedSchema = SchemaFactory.createForClass(OAssociated);
