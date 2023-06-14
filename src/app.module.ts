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
import { DeductionModule } from './deduction/deduction.module';
import { DepartmentModule } from './department/department.module';
import { EarningModule } from './earning/earning.module';
import { ErConfigModule } from './er_config/er_config.module';
import { LeaveModule } from './leave/leave.module';
import { OSubscriptionModule } from './o_subscription/o_subscription.module';
import { OrganizationModule } from './organization/organization.module';
import { PositionModule } from './position/position.module';
import { ProjectModule } from './project/project.module';
import { PromotionModule } from './promotion/promotion.module';
import { ReportModule } from './report/report.module';
import { SalaryModule } from './salary/salary.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TeamModule } from './team/team.module';
import { UserModule } from './user/user.module';
import { UserOvertimeModule } from './user_overtime/user_overtime.module';
import { WorkingHourModule } from './working_hour/working_hour.module';

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
    EarningModule,
    DeductionModule,
    BreakModule,
    UserOvertimeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
