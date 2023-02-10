import { OmitType } from '@nestjs/mapped-types';
import { Category } from '../schema/category.schema';

export class CreateCategoryDto extends OmitType(Category, ['type']) {}
