import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { FieldValue } from 'src/core/schema/common.schema';
import { CustomBreak } from '../schema/custom_break.schema';

export class RequestCustomBreakDto extends PickType(CustomBreak, ['proposedHour']) {
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => FieldValue)
	fieldValues: FieldValue[];
}
