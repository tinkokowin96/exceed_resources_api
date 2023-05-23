import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Attachment } from 'src/common/schema/common.schema';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class Collaborator extends CoreSchema {
  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => Attachment)
  attachments: Attachment[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  colleague: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  role: Category;
}

export const CollaboratorSchema = SchemaFactory.createForClass(Collaborator);
