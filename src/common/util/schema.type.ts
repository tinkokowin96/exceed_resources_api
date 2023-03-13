import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Cupon } from 'src/er_app/schema/cupon.schema';
import { OLeave } from 'src/leave/schema/o_leave.schema';
import { Department } from 'src/organization/schema/department.schema';
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

export class CuponCodeType {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  numCupon: number;
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
  @IsBoolean()
  onlyStandard: boolean;

  @IsNotEmpty()
  @IsEnum(EPaymentMethod)
  paymentMethod: EPaymentMethod;

  @ValidateNested()
  cupon: Cupon;
}

export class CommentTextType {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  colleagueId: string;
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
