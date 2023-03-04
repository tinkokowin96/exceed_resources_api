import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Department } from 'src/organization/schema/department.schema';
import { Cupon } from 'src/er_app/schema/cupon.schema';
import { EAttachment, EExtra, EField, EPaymentMethod, ETrigger } from './enumn';
import { PickType } from '@nestjs/mapped-types';

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
  @IsEnum(EExtra)
  type: EExtra;
}

export class PayExtraType extends ExtraType {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TriggerType)
  trigger: TriggerType;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ExtraType)
  reward: ExtraType;
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
