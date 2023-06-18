import { Type } from 'class-transformer';
import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Branch } from 'src/branch/branch.schema';
import { Break } from 'src/break/schema/break.schema';
import { Hour } from 'src/common/schema/common.schema';
import { Department } from 'src/department/department.schema';
import { OSubscription } from 'src/o_subscription/o_subscription.schema';
import { Position } from 'src/position/position.schema';

//NOTE: flexibleworkinghour, checkin, checkout and break will null for non custom(use value from config)

export class OAssociated {
  @IsNotEmpty()
  @IsBoolean()
  accessOAdminApp: boolean;

  @IsNumber()
  numPoint: number;

  @IsString()
  remark?: string;

  @ValidateNested()
  @Type(() => Hour)
  checkInTime?: Hour;

  @ValidateNested()
  @Type(() => Hour)
  checkOutTime?: Hour;

  @IsNotEmpty()
  @IsMongoId()
  branch: Branch;

  @IsNotEmpty()
  @IsMongoId()
  position: Position;

  @IsMongoId({ each: true })
  breaks: Break[];

  @IsMongoId({ each: true })
  departments: Department[];

  @IsMongoId({ each: true })
  subscriptions: OSubscription[];
}
