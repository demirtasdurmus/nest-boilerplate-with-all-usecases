import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LOCAL_STRATEGY } from '../constants/local-strategy.constant';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from '../../../constants/public-key.constant';

@Injectable()
export class LocalAuthGuard extends AuthGuard(LOCAL_STRATEGY) {
  constructor(private reflector: Reflector) {
    super();
  }

  /* Check this later */
  getAuthenticateOptions(context: ExecutionContext) {
    const options = super.getAuthenticateOptions(context);
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      return { ...options, authInfo: false };
    }
    return options;
  }

  /* Check this later */
  // eslint-disable-next-line @typescript-eslint/ban-types
  logIn<TRequest extends { logIn: Function } = any>(request: TRequest): Promise<void> {
    return super.logIn(request);
  }
}
