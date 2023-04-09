import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const { currentUser } = context.switchToHttp().getRequest<Request>() || {};

    if (!currentUser) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
