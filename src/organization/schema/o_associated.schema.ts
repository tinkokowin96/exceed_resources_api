import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { WorkingHourType } from 'src/common/util/schema.type';
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
  @ValidateNested({ each: true })
  @Type(() => Organization)
  organization: Organization;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Position' })
  @ValidateNested({ each: true })
  @Type(() => Position)
  position: Position;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Permission' })
  @ValidateNested()
  @Type(() => Permission)
  permission: Permission;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Break' }] })
  @ValidateNested()
  @Type(() => Break)
  breaks: Break[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Department' }] })
  @ValidateNested({ each: true })
  @Type(() => Department)
  departments: Department[];
}

export const OAssociatedSchema = SchemaFactory.createForClass(OAssociated);
