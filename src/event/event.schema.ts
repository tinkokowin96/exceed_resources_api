import { Prop, Schema } from '@nestjs/mongoose';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class Event extends CoreSchema {
  @Prop({ type: String })
  @IsString()
  name: string;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  showName?: boolean;

  @Prop({ type: String })
  @IsString()
  content?: string;

  @Prop({ type: String })
  @IsString()
  image?: string;

  @Prop({ type: String })
  @IsString()
  linkTo?: string;

  @Prop({ type: Boolean })
  @IsBoolean()
  isAppLink?: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  @IsNotEmpty()
  type: Category;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  @IsNotEmpty()
  createdBy: User;
}
