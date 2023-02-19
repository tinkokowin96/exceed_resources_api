import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { Response } from 'express';
import { LoginAccountDto } from '../dto/login_account.dto';
import { Audit } from '../schema/audit.schema';
import { encrypt } from '../util/encrypt';
import { AppRequest } from '../util/type';
import { CoreService } from './core.service';

export abstract class UserService extends CoreService {
  async login(dto: LoginAccountDto, req: AppRequest, res: Response, audit: Omit<Audit, '_id' | 'updatedAt'>) {
    return this.makeTransaction({
      action: async () => {
        const user = await this.findOne({ $or: [{ userName: dto.userName }, { email: dto.email }] });
        const matchPassword = compareSync(dto.password, user.password);

        if (!user.active) throw new ForbiddenException('User is not active');

        if (!user || !matchPassword) throw new NotFoundException('Wrong userName or password');

        if (user.loggedIn) throw new BadRequestException('User already logged in');

        if (user.blocked) throw new ForbiddenException(`User is blocker for ${user.blockReason}`);

        const encrypted = await encrypt(
          process.env.ENC_PASSWORD,
          JSON.stringify({
            id: user._id,
            type: user.type,
          }),
        );

        const max_age = 15 * 24 * 60 * 60 * 1000;
        res.cookie('user', encrypted, {
          httpOnly: true,
          maxAge: max_age,
        });

        await user.updateOne({ $set: { loggedIn: true } });
        return 'Successfully logged in';
      },
      res,
      req,
      audit,
    });
  }

  async logout(req: AppRequest, res: Response, audit: Omit<Audit, '_id' | 'updatedAt'>) {
    return this.makeTransaction({
      action: async () => {
        const user = await this.findById(req.user._id, null, null, { lean: false });
        await user.updateOne({ $set: { loggedIn: false } });
        res.clearCookie('user');
        return 'Successfully logged out';
      },
      req,
      res,
      audit,
    });
  }

  // async forgotPassword(email: string) {
  //     return null;
  // }

  // async changePassword(dto: ChangePasswordDto) {
  //     return null;
  // }
}
