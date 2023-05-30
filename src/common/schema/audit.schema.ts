import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsEnum, IsIP, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { EModule, EServiceTrigger } from 'src/common/util/enumn';
import { User } from 'src/user/schema/user.schema';

class TriggerTo {
  @IsNotEmpty()
  @IsString()
  service: string;

  @IsNotEmpty()
  @IsEnum(EServiceTrigger)
  type: EServiceTrigger;
}

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

  @Prop({ type: [SchemaTypes.Mixed] })
  @ValidateNested({ each: true })
  @Type(() => TriggerTo)
  triggeredServices?: TriggerTo[];

  @Prop({ type: SchemaTypes.Mixed })
  payload?: any;

  @Prop({ type: SchemaTypes.Mixed })
  prev?: any;

  @Prop({ type: SchemaTypes.Mixed })
  next?: any;

  @Prop({ type: String })
  @IsIP()
  submittedIP?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  submittedUser?: User;
}

export const AuditSchema = SchemaFactory.createForClass(Audit);
