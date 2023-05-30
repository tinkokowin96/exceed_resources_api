import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Subscription } from './subscription.schema';

export class BatchSubscriptionPrice {
  @IsNotEmpty()
  @IsMongoId()
  subscription: Subscription;

  @IsNotEmpty()
  @IsNumber()
  leastDay: number;

  @IsNotEmpty()
  @IsNumber()
  leastEmployee: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsString()
  remark: string;
}
