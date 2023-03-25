import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export interface ICurrentUser {
  id: string;
  email: string;
  roles: string[];
}

export const CurrentUser = createParamDecorator<keyof ICurrentUser>(
  (data: keyof ICurrentUser, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();

    return data ? req.user?.[data] : req.user;
  },
);
