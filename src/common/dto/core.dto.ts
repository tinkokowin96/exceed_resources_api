import { Type } from '@nestjs/common';
import { OmitType } from '@nestjs/mapped-types';
import { CoreSchema } from '../schema/core.shema';

export function AppOmit<T extends CoreSchema, K extends keyof Omit<T, '_id' | 'createdAt' | 'updatedAt'>>(
  type: Type<T>,
  keys?: K[],
) {
  return OmitType(type, ['_id', 'createdAt', 'updatedAt', ...(keys ?? [])]) as Type<
    Omit<T, '_id' | 'createdAt' | 'updatedAt'> & Partial<Pick<T, K>>
  >;
}
