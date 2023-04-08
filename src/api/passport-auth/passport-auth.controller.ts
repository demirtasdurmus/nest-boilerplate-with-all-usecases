import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PassportAuthService } from './passport-auth.service';
import { JwtBearerAuthGuard } from './guards/jwt-bearer.guard';

@Controller('passport-auth')
export class PassportAuthController {
  constructor(private readonly authService: PassportAuthService) {}

  @Post('login-bearer')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request) {
    return this.authService.createAccessToken(req.user);
  }

  @Get('profile-bearer')
  @UseGuards(JwtBearerAuthGuard)
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
