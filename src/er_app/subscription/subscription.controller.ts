import { Controller } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('er-app/subscription')
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}
}
