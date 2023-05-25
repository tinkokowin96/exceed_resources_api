import { OmitType } from '@nestjs/mapped-types';
import { Position } from '../schema/position.schema';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePositionDto extends OmitType(Position, ['permission']) {
  @IsNotEmpty()
  @IsString()
  permissionId: string;
}
