import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IConfig } from '../../../config/config.interface';
import { ConfigService } from '@nestjs/config';
import { IAuthUser } from '../passport-auth.service';
import { UserService } from '../../../api/user/user.service';
import { IUser } from 'src/api/user/interfaces/user.interface';
import { Request } from 'express';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy, 'jwt-cookie') {
  constructor(private readonly userService: UserService, private readonly config: ConfigService<IConfig, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtCookieStrategy.extractJWTFromCookie]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET', { infer: true }),
    });
  }

  async validate(payload: IAuthUser) {
    const user = (await this.userService.findByEmail(payload.email)) as IUser;
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { id: user.id, email: user.email, roles: user.roles };
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }
    return null;
  }
}
