import { IsNotEmpty, IsString } from 'class-validator';

export class ApproveSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  requestId: string;
}
