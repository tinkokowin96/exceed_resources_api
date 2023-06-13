import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Category } from 'src/category/category.schema';
import { Department } from 'src/department/department.schema';
import { Cupon } from 'src/cupon/schema/cupon.schema';
import { Promotion } from 'src/promotion/promotion.schema';
import { OLeave } from 'src/leave/schema/o_leave.schema';
import { SalaryCategory } from 'src/salary/schema/salary_category.schema';
import { EAttachment, EExtraAllowance, EMessage, ETrigger } from '../util/enumn';
import { IsEmoji } from '../util/is_emoji.validator';

export class WorkingHour {
  @IsNotEmpty()
  @Min(0)
  @Max(23)
  hour: number;

  @IsNotEmpty()
  @Min(0)
  @Max(60)
  minute: number;
}

export class Attachment {
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

export class Text {
  @IsNotEmpty()
  @IsEnum(EMessage)
  type: EMessage;

  @IsNotEmpty()
  @IsString()
  text: string;
}

export class Emoji {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @Validate(IsEmoji)
  emoji: string;

  @IsNotEmpty()
  @IsString()
  reactedUserName: string;

  @IsNotEmpty()
  @IsString()
  reactedUserId: string;
}

export class Message {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Text)
  text: Text;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Emoji)
  reactions: Emoji[];
}

export class Payment {
  @IsNotEmpty()
  @IsNumber()
  originalAmount: number;

  @IsNotEmpty()
  @IsString()
  paymentProof: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  payAmount: number;

  @IsNumber()
  pointsEarned: number;

  @IsNumber()
  surplus?: number;

  @IsString()
  cuponCode?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Category)
  paymentMethod: Category;

  @ValidateNested()
  @Type(() => Cupon)
  cupon?: Cupon;

  @ValidateNested()
  @Type(() => Promotion)
  promotion?: Promotion;
}

export class Trigger {
  @IsNotEmpty()
  @IsEnum(ETrigger)
  type: ETrigger;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class Extra extends PickType(Trigger, ['amount']) {
  @IsNotEmpty()
  @IsBoolean()
  isPoint: boolean;

  @IsNotEmpty()
  @IsEnum(EExtraAllowance)
  type: EExtraAllowance;

  @ValidateNested()
  @Type(() => OLeave)
  extraLeave?: OLeave;

  @ValidateNested()
  @Type(() => SalaryCategory)
  extraSalaryCategory?: SalaryCategory;
}

export class PromotionAllowance extends PickType(Extra, ['amount', 'isPoint']) {
  @IsNotEmpty()
  @IsBoolean()
  isPercent: boolean;
}

export class PayExtra {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Trigger)
  trigger: Trigger;

  @IsNotEmpty()
  @IsBoolean()
  reward: boolean;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Extra)
  extra: Extra;
}

export class LeaveAllowedDepartment {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Department)
  department: Department;

  @IsNotEmpty()
  @IsNumber()
  num_allowed: number;
}

export class Location {
  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  lng: number;
}
