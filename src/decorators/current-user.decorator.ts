import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ICurrentUser } from '../interfaces/current-user.interface';

export const CurrentUser = createParamDecorator<keyof ICurrentUser>(
  (data: keyof ICurrentUser, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    const { user }: { user: ICurrentUser } = req;

    return data ? user[data] : user;
  },
);
