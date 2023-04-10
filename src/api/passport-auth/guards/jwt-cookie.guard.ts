import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PUBLIC_KEY } from '../../../constants/public-key.constant';
import { JWT_COOKIE_STRATEGY } from '../constants/jwt-cookie-strategy.constant';

/* Simple Guard*/

// @Injectable()
// export class JwtCookieAuthGuard extends AuthGuard(JWT_COOKIE_STRATEGY) {}

/* Extending Guard*/
@Injectable()
export class JwtCookieAuthGuard extends AuthGuard(JWT_COOKIE_STRATEGY) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  // handleRequest(err, user, info) {
  //   // You can throw an exception based on either "info" or "err" arguments
  //   if (err || !user) {
  //     throw err || new UnauthorizedException();
  //   }
  //   return user;
  // }
}

/* Adding multiple strategies */
// export class JwtCookieAuthGuard extends AuthGuard(['strategy_jwt_1', 'strategy_jwt_2', '...']) { ... }
