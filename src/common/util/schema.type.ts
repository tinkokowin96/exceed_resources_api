import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Department } from 'src/department/schema/department.schema';
import { OLeave } from 'src/leave/schema/o_leave.schema';
import { SalaryCategory } from 'src/salary/schema/salary_category.schema';
import { EAttachment, EExtraAllowance, EField, EPaymentMethod, ETrigger } from './enumn';

export class WorkingHourType {
  @IsNotEmpty()
  @Min(0)
  @Max(23)
  hour: number;

  @IsNotEmpty()
  @Min(0)
  @Max(60)
  minute: number;
}

export class AttachmentType {
  @IsNotEmpty()
  @IsEnum(EAttachment)
  type: EAttachment;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  data: any;
}

export class PaymentType {
  @IsNotEmpty()
  @IsString()
  paymentProof: string;

  @IsNotEmpty()
  @IsNumber()
  originalAmount: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsEnum(EPaymentMethod)
  paymentMethod: EPaymentMethod;
}

export class TriggerType {
  @IsNotEmpty()
  @IsEnum(ETrigger)
  type: ETrigger;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class ExtraType extends PickType(TriggerType, ['amount']) {
  @IsNotEmpty()
  @IsBoolean()
  isPoint: boolean;

  @IsNotEmpty()
  @IsEnum(EExtraAllowance)
  type: EExtraAllowance;

  @IsNumber()
  extreaAmount?: number;

  @ValidateNested()
  @Type(() => OLeave)
  extraLeave?: OLeave;

  @ValidateNested()
  @Type(() => SalaryCategory)
  extraSalaryCategory?: SalaryCategory;
}

export class PayExtraType {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TriggerType)
  trigger: TriggerType;

  @IsNotEmpty()
  @IsBoolean()
  reward: boolean;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ExtraType)
  extra: ExtraType;
}

export class LeaveAllowedDepartmentType {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Department)
  department: Department;

  @IsNotEmpty()
  @IsNumber()
  num_allowed: number;
}

export class ReportTypeType {
  @IsNotEmpty()
  @IsEnum(EField)
  type: EField.CUser | EField.Position | EField.Department;

  @IsNotEmpty()
  value: any;
}

export class LocationType {
  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  lng: number;
}
