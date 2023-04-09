import { Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PassportAuthService } from './passport-auth.service';
import { JwtBearerAuthGuard } from './guards/jwt-bearer.guard';
import { JwtCookieAuthGuard } from './guards/jwt-cookie.guard';
import { ConfigService } from '@nestjs/config';
import { IConfig } from '../../config/config.interface';
import { IJwtData } from 'src/interfaces/jwt.interface';

@Controller('passport-auth')
export class PassportAuthController {
  constructor(
    private readonly authService: PassportAuthService,
    private readonly config: ConfigService<IConfig, true>,
  ) {}

  /* Bearer Token Implementation */
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

  @Get('logout-bearer')
  logout() {
    return 'Nothing to perform here, maybe you want to clear the cookie? 🤷‍♂️';
  }

  @Post('login-cookie')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async loginCookie(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.createAccessToken(req.user as IJwtData);

    const day = this.config.get('JWT_EXPIRES_IN', { infer: true }).split('').slice(0, -1).join('');
    const expires = new Date(Date.now() + Number(day) * 24 * 60 * 60 * 1000);

    res.cookie('access_token', token, {
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
}
