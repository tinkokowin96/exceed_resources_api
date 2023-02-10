import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { CoreSchema } from 'src/common/schema/core.shema';
import { EModule } from 'src/common/util/enumn';

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

  @Prop({ type: SchemaTypes.Mixed })
  payload: any;

  @Prop({ type: SchemaTypes.Mixed })
  prev?: any;

  @Prop({ type: SchemaTypes.Mixed })
  next?: any;
}

export const AuditSchema = SchemaFactory.createForClass(Audit);
