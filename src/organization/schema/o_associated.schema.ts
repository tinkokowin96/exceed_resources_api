import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { OUserWorkingHour } from 'src/o_user/schema/o_user_working_hour.schema';
import { Permission } from 'src/permission/permission.schema';
import { Department } from './department.schema';
import { Organization } from './organization.schema';
import { Position } from './position.schema';

@Schema()
export class OAssociated extends CoreSchema {
  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  superAdmin: boolean;

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OUserWorkingHour' })
  @ValidateNested()
  workingHour: OUserWorkingHour;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  @ValidateNested({ each: true })
  organization: Organization;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Position' })
  @ValidateNested({ each: true })
  position: Position;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Permission' })
  @ValidateNested()
  permission: Permission;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Department' }] })
  @ValidateNested({ each: true })
  departments: Department[];
}

export const OAssociatedSchema = SchemaFactory.createForClass(OAssociated);
