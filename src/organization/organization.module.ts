import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/category/schema/category.schema';
import { OUser, OUserSchema } from 'src/o_user/schema/o_user.schema';
import { OrganizationController } from './controller/organization.controller';
import { Organization, OrganizationSchema } from './schema/organization.schema';
import { OAssociated, OAssociatedSchema } from './schema/o_associated.schema';
import { OConfig, OConfigSchema } from './schema/o_config.schema';
import { OrganizationService } from './service/organization.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: Category.name, schema: CategorySchema },
      { name: OConfig.name, schema: OConfigSchema },
      { name: OAssociated.name, schema: OAssociatedSchema },
      { name: OUser.name, schema: OUserSchema },
    ]),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
