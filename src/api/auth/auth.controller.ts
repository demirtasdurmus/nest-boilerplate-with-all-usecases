import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request } from 'express';
import { Public } from '../../decorators/public.decorator';
import { ApiConflictResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './guards/auth.guard';
@Controller('auth')
@ApiTags('Auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @ApiCreatedResponse()
  @ApiConflictResponse()
  @Post('register')
  @Public()
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('logout')
  @Public()
  logout() {
    return 'Nothing to perform here, maybe you want to clear the cookie? 🤷‍♂️';
  }

  @Get('me')
  me(@Req() req: Request) {
    return req.user;
  }
}
