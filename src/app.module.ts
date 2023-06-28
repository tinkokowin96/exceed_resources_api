import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BranchModule } from './branch/branch.module';
import { BreakModule } from './break/break.module';
import { CategoryModule } from './category/category.module';
import { ChatModule } from './chat/chat.module';
import { CommonModule } from './common/common.module';
import { CuponModule } from './cupon/cupon.module';
import { DepartmentModule } from './department/department.module';
import { ErConfigModule } from './er_config/er_config.module';
import { ExtraSalaryModule } from './extra_salary/extra_salary.module';
import { LeaveModule } from './leave/leave.module';
import { OSubscriptionModule } from './o_subscription/o_subscription.module';
import { OrganizationModule } from './organization/module/organization.module';
import { PositionModule } from './position/position.module';
import { ProjectModule } from './project/project.module';
import { PromotionModule } from './promotion/promotion.module';
import { ReportModule } from './report/report.module';
import { SalaryModule } from './salary/salary.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TeamModule } from './team/team.module';
import { UserModule } from './user/user.module';
import { OvertimeModule } from './overtime/overtime.module';
import { WorkingHourModule } from './working_hour/working_hour.module';
import { NotificationModule } from './notification/notification.module';
import { MasterDataModule } from './master_data/master_data.module';

/**
 * TODO: calculate statistic tasks at night (penalize if late not approved)
 *
 */
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI, { loggerLevel: 'info' }),
    CommonModule,
    ChatModule,
    OrganizationModule,
    ReportModule,
    SalaryModule,
    AuthModule,
    CategoryModule,
    UserModule,
    ProjectModule,
    LeaveModule,
    DepartmentModule,
    PositionModule,
    TeamModule,
    ErConfigModule,
    CuponModule,
    PromotionModule,
    SubscriptionModule,
    OSubscriptionModule,
    BranchModule,
    WorkingHourModule,
    ExtraSalaryModule,
    BreakModule,
    OvertimeModule,
    NotificationModule,
    MasterDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
