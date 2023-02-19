import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Department } from 'src/organization/schema/department.schema';
import { Voucher } from 'src/organization/schema/voucher.schema';
import { EAttachment, EField, EPaymentMethod, ETrigger } from './enumn';

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
  @IsBoolean()
  onlyStandard: boolean;

  @IsNotEmpty()
  @IsEnum(EPaymentMethod)
  paymentMethod: EPaymentMethod;

  @ValidateNested()
  voucher: Voucher;
}

export class CommentTextType {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  colleagueId: string;
}

export class ExtraType {
  @IsNotEmpty()
  @IsNumber()
  point: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsBoolean()
  amountAbsolute: boolean;
}

export class TriggerType {
  @IsNotEmpty()
  @IsEnum(ETrigger)
  type: ETrigger;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class PayExtraType extends ExtraType {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PayExtraType)
  trigger: TriggerType;
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
