import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { AppOmit } from 'src/common/dto/core.dto';
import { Subscription } from 'src/subscription/subscription.schema';

export class CreateSubscriptionDto extends AppOmit(Subscription, ['activePromotion']) {
  @IsString()
  promotionId?: string;
}

class UpdateRouteDto {
  @IsNotEmpty()
  @IsString()
  route: string;

  @IsNotEmpty()
  @IsBoolean()
  add: boolean;
}

class UpdatePriceDto {
  @IsNotEmpty()
  @IsNumber()
  numEmployee: number;

  @IsNotEmpty()
  @IsNumber()
  numDay: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
  @IsNotEmpty()
  @IsString()
  id: string;

  @ValidateNested({ each: true })
  @Type(() => UpdateRouteDto)
  routes?: UpdateRouteDto[];

  @ValidateNested({ each: true })
  @Type(() => UpdatePriceDto)
  prices?: UpdatePriceDto[];
}
