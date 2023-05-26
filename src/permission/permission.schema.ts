import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CoreSchema } from 'src/common/schema/core.shema';

@Schema()
export class Permission extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: [String], default: [] })
  @IsString({ each: true })
  allowedRoutes?: string[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }] })
  @ValidateNested({ each: true })
  @Type(() => Category)
  assignableRoles?: Category[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
