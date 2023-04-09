import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ICurrentUser } from '../types/express';

export const CurrentUser = createParamDecorator((_data: never, ctx: ExecutionContext): ICurrentUser => {
  const req = ctx.switchToHttp().getRequest<Request>();

  return req.currentUser!;
});
