import { Prop, Schema } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { OUser } from 'src/o_user/schema/o_user.schema';

@Schema()
export class Team extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String })
  @IsString()
  remark: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OUser' })
  leader: OUser;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OUser' })
  members: OUser;
}
