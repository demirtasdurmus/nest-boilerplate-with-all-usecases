import { Body, Controller, Get, HttpCode, Post, Session, UseGuards } from '@nestjs/common';
import { CookieSessionAuthService } from './cookie-session-auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ICurrentUser } from './types/express';

@Controller('cookie-session-auth')
export class CookieSessionAuthController {
  constructor(private readonly authService: CookieSessionAuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginUserDto, @Session() session: any) {
    const user = await this.authService.login(loginDto);
    session.user = user;
    return { message: 'success' };
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoami(@CurrentUser() data: ICurrentUser) {
    return data;
  }

  @Get('logout')
  async logout(@Session() session: any): Promise<void> {
    session.user = null;
    return;
  }
}
