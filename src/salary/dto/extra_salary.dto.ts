import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ApproveExtraSalryDto {
  @IsNotEmpty()
  @IsBoolean()
  late: boolean;

  @IsString()
  id?: string;
}
