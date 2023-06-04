import { OmitType } from '@nestjs/mapped-types';
import { Category } from './category.schema';

export class CreateCategoryDto extends OmitType(Category, ['type']) {}
