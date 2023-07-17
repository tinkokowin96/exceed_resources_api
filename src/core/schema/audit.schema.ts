import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsIP, IsNotEmpty, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/core/schema/core.shema';
import { EModule } from 'src/core/util/enumn';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class Audit extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String, enum: EModule })
  @IsNotEmpty()
  @IsEnum(EModule)
  module: EModule;

  @Prop({ type: String })
  @IsString()
  triggeredBy?: string;

  @Prop({ type: SchemaTypes.Mixed })
  payload?: any;

  @Prop({ type: SchemaTypes.Mixed })
  response?: any;

  @Prop({ type: String })
  @IsIP()
  submittedIP?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  submittedUser?: User;
}

export const AuditSchema = SchemaFactory.createForClass(Audit);
