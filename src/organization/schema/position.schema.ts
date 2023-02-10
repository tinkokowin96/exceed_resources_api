import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { OUser } from 'src/o_user/schema/o_user.schema';
import { Permission } from 'src/permission/permission.schema';

@Schema()
export class Position extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  shortName: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  basicSalary: string;

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Permission' })
  @IsNotEmpty()
  @ValidateNested()
  permission: Permission;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'OUser' }] })
  @ValidateNested({ each: true })
  colleagues: OUser[];
}

export const PositionSchema = SchemaFactory.createForClass(Position);
