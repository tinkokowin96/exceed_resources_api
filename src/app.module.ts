import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BankModule } from './bank/bank.module';
import { CategoryModule } from './category/category.module';
import { ChatModule } from './chat/chat.module';
import { CommonModule } from './common/common.module';
import { ErAppModule } from './er_app/er_app.module';
import { OrganizationModule } from './organization/organization.module';
import { OAdminAppModule } from './o_admin_app/o_admin_app.module';
import { OUserModule } from './o_user/o_user.module';
import { PermissionModule } from './permission/permission.module';
import { ProjectModule } from './project/project.module';
import { ReportModule } from './report/report.module';
import { SalaryModule } from './salary/salary.module';
import { LateModule } from './late/late.module';
import { LeaveModule } from './leave/leave.module';
import { OvertimeModule } from './overtime/overtime.module';
import { DepartmentModule } from './department/department.module';
import { BreakModule } from './break/break.module';
import { PositionModule } from './position/position.module';
import { TeamModule } from './team/team.module';
import { SubscriptionModule } from './subscription/subscription_request.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI, { loggerLevel: 'info' }),
    CommonModule,
    ChatModule,
    OrganizationModule,
    ReportModule,
    SalaryModule,
    OAdminAppModule,
    ErAppModule,
    AuthModule,
    CategoryModule,
    PermissionModule,
    OUserModule,
    BankModule,
    ProjectModule,
    LateModule,
    LeaveModule,
    OvertimeModule,
    DepartmentModule,
    BreakModule,
    PositionModule,
    TeamModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
