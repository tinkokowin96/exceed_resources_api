import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Location } from 'src/common/schema/common.schema';
import { CoreSchema } from 'src/common/schema/core.shema';
import { OConfig } from 'src/organization/schema/o_config.schema';
import { Organization } from 'src/organization/schema/organization.schema';

@Schema()
export class Branch extends CoreSchema {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  address: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Location)
  location: Location;

  @Prop({ type: String })
  @IsString()
  remark?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  @IsNotEmpty()
  organization: Organization;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'OConfig' })
  @IsNotEmpty()
  config: OConfig;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
