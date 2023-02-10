import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { AttachmentType } from 'src/common/util/schema.type';
import { OUser } from 'src/o_user/schema/o_user.schema';

@Schema()
export class Collaborator extends CoreSchema {
  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  attachments: AttachmentType[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OUser' })
  @ValidateNested()
  colleague: OUser;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  @ValidateNested()
  role: Category;
}

export const CollaboratorSchema = SchemaFactory.createForClass(Collaborator);
