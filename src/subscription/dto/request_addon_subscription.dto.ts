import { IsEnum, IsNotEmpty } from 'class-validator';
import { EAddon } from 'src/common/util/enumn';
import { RequestSubscriptionDto } from './request_subscription.dto';

export class RequestAddonSubscriptionDto extends RequestSubscriptionDto {
  @IsNotEmpty()
  @IsEnum(EAddon)
  addon: EAddon;
}
