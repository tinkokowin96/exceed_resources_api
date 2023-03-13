import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { ExtraType, WorkingHourType } from 'src/common/util/schema.type';
import { OUser } from 'src/o_user/schema/o_user.schema';

@Schema()
export class OUserLate extends CoreSchema {
  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WorkingHourType)
  lateTime: WorkingHourType;

  @Prop({ type: SchemaTypes.Mixed })
  @ValidateNested()
  @Type(() => ExtraType)
  penalty: ExtraType;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OUser' })
  approvedBy: OUser;
}

export const OUserLateSchema = SchemaFactory.createForClass(OUserLate);
