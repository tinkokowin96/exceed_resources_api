import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ChatModule } from './chat/chat.module';
import { CommonModule } from './common/common.module';
import { DepartmentModule } from './department/department.module';
import { ErAppModule } from './er_app/er_app.module';
import { LateModule } from './late/late.module';
import { LeaveModule } from './leave/leave.module';
import { OAdminAppModule } from './o_admin_app/o_admin_app.module';
import { OrganizationModule } from './organization/organization.module';
import { OvertimeModule } from './overtime/overtime.module';
import { PositionModule } from './position/position.module';
import { ProjectModule } from './project/project.module';
import { ReportModule } from './report/report.module';
import { SalaryModule } from './salary/salary.module';
import { TeamModule } from './team/team.module';
import { UserModule } from './user/user.module';

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
    UserModule,
    ProjectModule,
    LateModule,
    LeaveModule,
    OvertimeModule,
    DepartmentModule,
    PositionModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
