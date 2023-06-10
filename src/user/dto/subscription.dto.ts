import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Subscription } from 'src/er_app/subscription/subscription.schema';

export class CreateSubscriptionDto extends OmitType(Subscription, [
  'activePromotion',
  '_id',
  'createdAt',
  'updatedAt',
]) {
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
