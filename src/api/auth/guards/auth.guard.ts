import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IConfig } from '../../../config/config.interface';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from '../../../constants/public-key.constant';
import { UserService } from '../../../api/user/user.service';
import { IJwtPayload } from '../../../interfaces/jwt.interface';
import { ICurrentUser } from 'src/interfaces/current-user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<IConfig, true>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: IJwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('JWT_SECRET', { infer: true }),
      });

      const user = await this.userService.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException();
      }

      const currentUser: ICurrentUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      };

      // We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.user = currentUser;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
