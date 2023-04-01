import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService) {}

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(loginUserDto.email);
    if (user && user.password === loginUserDto.password) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
