import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { Position } from './position.schema';

export class CreatePositionDto extends OmitType(Position, ['_id', 'createdAt', 'updatedAt']) {}

export class UpdatePositionDto extends PartialType(OmitType(Position, ['_id', 'createdAt', 'updatedAt'])) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
