import { Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PassportAuthService } from './passport-auth.service';
import { JwtBearerAuthGuard } from './guards/jwt-bearer.guard';
import { JwtCookieAuthGuard } from './guards/jwt-cookie.guard';

@Controller('passport-auth')
export class PassportAuthController {
  constructor(private readonly authService: PassportAuthService) {}

  @Post('login-bearer')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async loginBearer(@Req() req: Request) {
    return this.authService.createAccessToken(req.user);
  }

  @Get('profile-bearer')
  @UseGuards(JwtBearerAuthGuard)
  getProfileBearer(@Req() req: Request) {
    return req.user;
  }

  @Post('login-cookie')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async loginCookie(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.createAccessToken(req.user);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
    });

    return { message: 'success' };
  }

  @Get('profile-cookie')
  @UseGuards(JwtCookieAuthGuard)
  getProfileCookie(@Req() req: Request) {
    return req.user;
  }
}
