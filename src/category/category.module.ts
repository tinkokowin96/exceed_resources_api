import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './controller/category.controller';
import { Category, CategorySchema } from './schema/category.schema';
import { CategoryService } from './service/category.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
