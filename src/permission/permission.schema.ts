import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { EUser } from 'src/common/util/enumn';

@Schema()
export class Permission extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String, enum: EUser, required: true })
  @IsNotEmpty()
  @IsEnum(EUser)
  type: EUser;

  @Prop({ type: [String], required: true })
  @IsNotEmpty()
  @IsString({ each: true })
  allowedRoutes: string[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }] })
  @ValidateNested({ each: true })
  assignableRoles: Category[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
