import { BadRequestException, Injectable } from '@nestjs/common';
import { CoreService } from 'src/common/service/core.service';
import { AccumulatedLeave } from '../schema/accumulated_leave.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateAccumulatedLeaveDto } from '../dto/accumulated_leave.dto';
import { AppRequest, TriggeredBy } from 'src/common/util/type';
import { Response } from 'express';
import { EModule } from 'src/common/util/enumn';
import { User } from 'src/user/schema/user.schema';
import { Leave } from '../schema/leave.schema';

@Injectable()
export class AccumulatedLeaveService extends CoreService<AccumulatedLeave> {
  constructor(
    @InjectModel(AccumulatedLeave.name) model: Model<AccumulatedLeave>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Leave.name) private readonly leaveModel: Model<Leave>,
    @InjectConnection() connection: Connection,
  ) {
    super(connection, model);
  }

  async createAccumulatedLeave(
    dto: CreateAccumulatedLeaveDto,
    req: AppRequest,
    res: Response,
    trigger?: TriggeredBy,
  ) {
    return this.makeTransaction({
      action: async (session) => {
        const { leaveId, grantedUserId, ...payload } = dto;
        let grantedUser;
        if (!payload.isEntitledLeave && !grantedUserId)
          throw new BadRequestException('Required granted user if not entitled leave');
        if (grantedUserId) grantedUser = await this.findById({ id: grantedUserId, custom: this.userModel });
        const leave = await this.findById({ id: leaveId, custom: this.leaveModel });
        return await this.create({
          dto: { ...payload, leave, grantedBy: grantedUser, year: new Date().getFullYear() },
          session,
        });
      },
      req,
      res,
      audit: {
        name: 'create-accumulated-leave',
        module: EModule.Leave,
        payload: dto,
        triggeredBy: trigger.service,
      },
    });
  }
}
