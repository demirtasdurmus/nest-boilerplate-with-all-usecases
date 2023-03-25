import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    console.log('Roles required by the route', roles);
    if (!roles) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    console.log('Passing Roles Guard', req.originalUrl);
    return true;
  }
}
