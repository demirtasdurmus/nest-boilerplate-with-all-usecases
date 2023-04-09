import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../../api/user/user.service';
import { IUser } from '../../../api/user/interfaces/user.interface';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const { user } = req.session || {};

    if (user) {
      const currentUser = (await this.userService.findByEmail(user.email)) as IUser;

      if (!currentUser) {
        throw new UnauthorizedException();
      }

      req.currentUser = {
        id: currentUser.id!,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        roles: currentUser.roles,
      };
    }

    next();
  }
}
