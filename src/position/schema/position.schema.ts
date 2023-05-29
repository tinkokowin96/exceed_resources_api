import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Permission } from 'src/permission/permission.schema';

@Schema()
export class Position extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String, required: true })
  @IsString()
  shortName: string;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  basicSalary: number;

  @Prop({ type: String })
  @IsString()
  remark?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Permission' })
  permission?: Permission;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
