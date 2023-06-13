import { PickType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { ErConfig } from '../schema/er_config.schema';

export class EditErConfigDto extends PickType(ErConfig, ['restrictedRoutes']) {
  @Prop({ type: String })
  @IsString()
  superAdminId: string;

  @Prop({ type: String })
  @IsString()
  baseCurrencyId: string;
}
