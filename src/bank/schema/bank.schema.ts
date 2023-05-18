import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { AttachmentType } from 'src/common/util/schema.type';
import { User } from 'src/user/schema/user.schema';

export class Bank extends CoreSchema {
  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => AttachmentType)
  attachment: AttachmentType;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  bank: Category;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  oUser: User;
}

export const BankSchema = SchemaFactory.createForClass(Bank);
