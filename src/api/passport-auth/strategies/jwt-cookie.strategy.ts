import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IConfig } from '../../../config/config.interface';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../../api/user/user.service';
import { Request } from 'express';
import { IJwtPayload } from '../../../interfaces/jwt.interface';
import { ICurrentUser } from '../../../interfaces/current-user.interface';
import { JWT_COOKIE_STRATEGY } from '../constants/jwt-cookie-strategy.constant';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy, JWT_COOKIE_STRATEGY) {
  constructor(private readonly userService: UserService, private readonly config: ConfigService<IConfig, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtCookieStrategy.extractJWTFromCookie]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET', { infer: true }),
    });
  }

  async validate(payload: IJwtPayload): Promise<ICurrentUser> {
    const user = await this.userService.findById(payload.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const currentUser: ICurrentUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
    };

    return currentUser;
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }
    return null;
  }
}
