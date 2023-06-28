import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/category/category.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { OrganizationController } from '../controller/organization.controller';
import { OConfig, OConfigSchema } from '../schema/o_config.schema';
import { Organization, OrganizationSchema } from '../schema/organization.schema';
import { OrganizationService } from '../service/organization.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: Category.name, schema: CategorySchema },
      { name: OConfig.name, schema: OConfigSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
