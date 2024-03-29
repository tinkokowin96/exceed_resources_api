import { IsDateString, IsNumber, IsString } from 'class-validator';

export class FindDto {
  @IsNumber()
  take: number;

  @IsNumber()
  page: number;

  @IsString()
  sort: string;

  @IsString()
  desc: boolean;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
