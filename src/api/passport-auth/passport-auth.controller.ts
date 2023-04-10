import { Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PassportAuthService } from './passport-auth.service';
import { JwtBearerAuthGuard } from './guards/jwt-bearer.guard';
import { JwtCookieAuthGuard } from './guards/jwt-cookie.guard';
import { ConfigService } from '@nestjs/config';
import { IConfig } from '../../config/config.interface';
import { IJwtData } from '../../interfaces/jwt.interface';
import { Public } from '../../decorators/public.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { ICurrentUser } from '../../interfaces/current-user.interface';

@Controller('passport-auth')
export class PassportAuthController {
  constructor(
    private readonly authService: PassportAuthService,
    private readonly config: ConfigService<IConfig, true>,
  ) {}

  /* Bearer Token Implementations */
  @Post('login-bearer')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async loginBearer(@Req() req: Request): Promise<{ accessToken: string }> {
    const accessToken = await this.authService.createAccessToken(req.user as IJwtData);

    return { accessToken };
  }

  @Get('profile-bearer')
  @UseGuards(JwtBearerAuthGuard)
  getProfileBearer(@Req() req: Request) {
    return req.user;
  }

  @Get('current-user-bearer')
  @UseGuards(JwtBearerAuthGuard)
  getCurrentUserBearer(@CurrentUser('email') email: ICurrentUser['email']) {
    return email;
  }

  @Get('public-bearer')
  @Public()
  @UseGuards(JwtBearerAuthGuard)
  getPublicInfoBearer(@Req() req: Request) {
    return `This is a public route, req user data: ${JSON.stringify(req.user)}`;
  }

  @Get('logout-bearer')
  logoutBearer() {
    return 'Nothing to perform here, maybe you want to revoke the token? 🤷‍♂️';
  }

  /* Http-only Cookie Implementations */
  @Post('login-cookie')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async loginCookie(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const accessToken = await this.authService.createAccessToken(req.user as IJwtData);

    const day = this.config.get('JWT_EXPIRES_IN', { infer: true }).split('').slice(0, -1).join('');
    const expires = new Date(Date.now() + Number(day) * 24 * 60 * 60 * 1000);

    res.cookie(this.config.get('AUTH_COOKIE_NAME', { infer: true }), accessToken, {
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
      expires,
    });

    return { message: 'success' };
  }

  @Get('profile-cookie')
  @UseGuards(JwtCookieAuthGuard)
  getProfileCookie(@Req() req: Request) {
    return req.user;
  }

  @Get('current-user-cookie')
  @UseGuards(JwtCookieAuthGuard)
  getCurrentUserCookie(@CurrentUser('email') email: ICurrentUser['email']) {
    return email;
  }

  @Get('public-cookie')
  @Public()
  @UseGuards(JwtCookieAuthGuard)
  getPublicInfoCookie(@Req() req: Request) {
    return `This is a public route, req user data: ${JSON.stringify(req.user)}`;
  }

  @Get('logout-cookie')
  logoutCookie(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.config.get('AUTH_COOKIE_NAME', { infer: true }));

    return { message: 'success' };
  }
}
