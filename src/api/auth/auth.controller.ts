/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request } from 'express';
import { Public } from '../../decorators/public.decorator';
import { ApiConflictResponse, ApiCreatedResponse, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  // @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
  @ApiCreatedResponse()
  @ApiConflictResponse()
  @Post('register')
  @Public()
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @ApiHeader({
  //   name: 'Set-Cookie',
  //   description: 'Set-Cookie',
  // })
  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('me')
  me(@Req() req: Request) {
    return req.user;
  }
}
