import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ICurrentUser } from '../interfaces/current-user.interface';

export const CurrentUser = createParamDecorator<keyof ICurrentUser>(
  (data: keyof ICurrentUser, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();

    return data ? req.currentUser?.[data] : req.currentUser;
  },
);
