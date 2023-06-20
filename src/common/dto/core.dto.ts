import { Type } from '@nestjs/common';
import { OmitType } from '@nestjs/mapped-types';
import { CoreSchema } from '../schema/core.shema';

export function AppOmit<T extends CoreSchema>(
  type: Type<T>,
  keys = [] as Array<keyof Omit<T, '_id' | 'createdAt' | 'updatedAt'>>,
) {
  return OmitType(type, ['_id', 'createdAt', 'updatedAt', ...keys]);
}
