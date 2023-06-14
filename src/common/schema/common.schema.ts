import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsMongoId,
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
import { Cupon } from 'src/cupon/schema/cupon.schema';
import { Department } from 'src/department/department.schema';
import { Leave } from 'src/leave/schema/leave.schema';
import { Promotion } from 'src/promotion/promotion.schema';
import { EAttachment, EExtra, EMessage } from '../util/enumn';
import { IsEmoji } from '../util/is_emoji.validator';

export class Hour {
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

export class Extra {
  @IsNotEmpty()
  @IsBoolean()
  isPoint: boolean;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsEnum(EExtra)
  type: EExtra;

  @ValidateNested()
  @Type(() => Leave)
  extraLeave?: Leave;
}

export class PromotionAllowance extends PickType(Extra, ['amount', 'isPoint']) {
  @IsNotEmpty()
  @IsBoolean()
  isPercent: boolean;
}

export class ExtraAllowance {
  @IsNotEmpty()
  @IsNumber()
  extraMinute: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Extra)
  allowance: Extra;
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
  @IsLatitude()
  lat: number;

  @IsNotEmpty()
  @IsLongitude()
  lng: number;
}

export class Counter {
  @IsNotEmpty()
  @IsDateString()
  start: Date;

  @IsNotEmpty()
  @IsDateString()
  end: Date;
}

export class FieldValue {
  @IsNotEmpty()
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  value: string;
}
