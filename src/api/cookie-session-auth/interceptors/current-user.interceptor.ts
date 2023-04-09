import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../../../api/user/user.service';
import { Request } from 'express';
import { IUser } from '../../../api/user/interfaces/user.interface';

// this interceptor won't be used in this example
// but it's a good example of how to use interceptors
// to add data to the request object
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const { user } = request.session || {};

    if (user) {
      const currentUser = (await this.userService.findByEmail(user.email)) as IUser;
      if (!currentUser) {
        throw new UnauthorizedException();
      }
      request.currentUser = {
        id: currentUser.id!,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        roles: currentUser.roles,
      };
    }
    return next.handle();
  }
}
