import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/category/schema/category.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { OrganizationController } from './organization.controller';
import { Organization, OrganizationSchema } from './schema/organization.schema';
import { OAssociated, OAssociatedSchema } from './schema/o_associated.schema';
import { OConfig, OConfigSchema } from './schema/o_config.schema';
import { OrganizationService } from './organization.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: Category.name, schema: CategorySchema },
      { name: OConfig.name, schema: OConfigSchema },
      { name: OAssociated.name, schema: OAssociatedSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
