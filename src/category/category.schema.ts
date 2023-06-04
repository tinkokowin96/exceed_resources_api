import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsHexColor, IsNotEmpty, IsString } from 'class-validator';
import { CoreSchema } from 'src/common/schema/core.shema';
import { ECategory } from 'src/common/util/enumn';

@Schema()
export class Category extends CoreSchema {
  @Prop({ type: String, required: true, unique: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String })
  @IsHexColor()
  color: string;

  @Prop({ type: String, enum: ECategory, required: true })
  @IsNotEmpty()
  @IsEnum(ECategory)
  type: ECategory;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
