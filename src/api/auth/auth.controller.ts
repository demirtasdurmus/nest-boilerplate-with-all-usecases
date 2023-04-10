import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request } from 'express';
import { Public } from '../../decorators/public.decorator';
import { ApiConflictResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './guards/auth.guard';
import { IResponseMessage } from '../../interfaces/response-message.interface';
import { ResponseMessage } from '../../utils/response-message.util';
import { CurrentUser } from '../../decorators/current-user.decorator';
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @ApiCreatedResponse()
  @ApiConflictResponse()
  @Post('register')
  @Public()
  async register(@Body() createUserDto: CreateUserDto): Promise<IResponseMessage> {
    await this.userService.create(createUserDto);
    return ResponseMessage('success');
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req: Request) {
    return req.user;
  }

  @Get('email')
  @UseGuards(AuthGuard)
  getEmail(@CurrentUser('email') email: string) {
    return email;
  }

  @Get('public')
  @Public()
  @UseGuards(AuthGuard)
  getPublicInfo(@Req() req: Request) {
    return `This is a public route, req user data: ${JSON.stringify(req.user)}`;
  }

  @Get('logout')
  @Public()
  logout() {
    return 'Nothing to perform here, maybe you want to revoke the access token? 🤷‍♂️';
  }
}
