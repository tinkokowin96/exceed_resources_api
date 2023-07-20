import { PickType } from '@nestjs/mapped-types';
import { CustomBreak } from '../schema/custom_break.schema';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FieldValue } from 'src/core/schema/common.schema';

export class RequestCustomBreakDto extends PickType(CustomBreak, ['proposedHour']) {
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => FieldValue)
	fieldValues: FieldValue[];
}
