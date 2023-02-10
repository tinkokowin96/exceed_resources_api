import { IsString } from 'class-validator';
import { LoginAccountDto } from 'src/common/dto/login_account.dto';

export class LoginOUserDto extends LoginAccountDto {
  @IsString()
  organizationId: string;
}
