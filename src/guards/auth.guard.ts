import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    console.log('Im running for and into:', context.getHandler().name, context.getClass().name);
    console.log('Passing Auth Guard', req.originalUrl);
    return true;
  }
}
