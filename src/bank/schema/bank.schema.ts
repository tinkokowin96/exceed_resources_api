import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { AttachmentType } from 'src/common/util/schema.type';
import { ErUser } from 'src/er_app/schema/er_user.schema';
import { OUser } from 'src/o_user/schema/o_user.schema';

export class Bank extends CoreSchema {
  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => AttachmentType)
  attachment: AttachmentType;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  @ValidateNested()
  @Type(() => Category)
  bank: Category;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'ErUser' })
  @ValidateNested()
  @Type(() => ErUser)
  erUser: ErUser;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OUser' })
  @ValidateNested()
  @Type(() => OUser)
  oUser: OUser;
}

export const BankSchema = SchemaFactory.createForClass(Bank);
