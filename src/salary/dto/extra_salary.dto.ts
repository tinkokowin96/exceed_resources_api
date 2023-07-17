import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CategoryDto } from 'src/core/dto/category.dto';
import { ExtraSalary } from '../schema/extra_salary.schema';

export class CreateExtraSalaryDto extends PickType(ExtraSalary, ['status', 'earning', 'extra']) {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;
}

export class ApproveExtraSalaryDto {
  @IsNotEmpty()
  @IsBoolean()
  late: boolean;

  @IsString()
  id?: string;
}
