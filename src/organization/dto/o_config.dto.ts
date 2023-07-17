import { IsString } from 'class-validator';
import { AppOmitWithExtra } from 'src/core/dto/core.dto';
import { OConfig } from '../schema/o_config.schema';

export class CreateOConfigDto extends AppOmitWithExtra(OConfig, ['overtimeForm']) {
  @IsString({ each: true })
  overtimeFormFieldIds: string[];
}
