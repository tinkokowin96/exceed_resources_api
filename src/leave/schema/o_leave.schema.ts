import { Prop, Schema } from '@nestjs/mongoose';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { Field } from 'src/common/schema/field.schema';
import { EPosition } from 'src/common/util/enumn';

@Schema()
export class OLeave extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsString()
  name: boolean;

  @Prop({ type: Number, required: true })
  @IsNumber()
  numAllowed: number;

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  category: Category;

  /**NOTE:
   * If there is assignable, no need approvable and form coz employee don't need to request
   * The purpose of this is to give as gift to employee by executives
   */
  @Prop({ type: [{ type: String, enum: EPosition }] })
  @IsEnum(EPosition, { each: true })
  leaveAssignablePositions: [EPosition];

  @Prop({ type: [{ type: String, enum: EPosition }] })
  @IsEnum(EPosition, { each: true })
  leaveApprovablePositions: [EPosition];

  @Prop({ type: [{ type: String, enum: EPosition }] })
  @IsEnum(EPosition, { each: true })
  leaveNotifyPositions: [EPosition];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Field' }] })
  form: Field[];
}
