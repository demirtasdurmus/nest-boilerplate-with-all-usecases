import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // const roles = this.reflector.get<string[]>('roles', context.getHandler()); // just for method level

    const roles = this.reflector.getAllAndMerge<string[]>('roles', [context.getHandler(), context.getClass()]); // gets for method and controller level and combine

    console.log('Roles required by the route:', roles);
    if (!roles) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    console.log('Passing Roles Guard', req.originalUrl);
    return true;
  }
}
