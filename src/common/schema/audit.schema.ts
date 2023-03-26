import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsIP, IsNotEmpty, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { EModule } from 'src/common/util/enumn';
import { ErUser } from 'src/er_app/schema/er_user.schema';
import { OUser } from 'src/o_user/schema/o_user.schema';

@Schema()
export class Audit extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String })
  @IsString()
  triggerBy?: string;

  @Prop({ type: String, enum: EModule })
  @IsNotEmpty()
  @IsEnum(EModule)
  module: EModule;

  @Prop({ type: SchemaTypes.Mixed })
  payload?: any;

  @Prop({ type: SchemaTypes.Mixed })
  prev?: any;

  @Prop({ type: SchemaTypes.Mixed })
  next?: any;

  @Prop({ type: String })
  @IsIP()
  submittedIP?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'ErUser' })
  submittedErUser?: ErUser;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OUser' })
  submittedOUser?: OUser;
}

export const AuditSchema = SchemaFactory.createForClass(Audit);
