import { IsNumber, IsString } from 'class-validator';

export class FindDto {
  @IsNumber()
  take: number;

  @IsNumber()
  page: number;

  @IsString()
  sort: string;
}
