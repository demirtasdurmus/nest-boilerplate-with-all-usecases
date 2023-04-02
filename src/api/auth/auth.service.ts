import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '@app/bcrypt/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmail(loginUserDto.email);

    if (user && (await this.bcryptService.compare(loginUserDto.password, user.password))) {
      const payload = { email: user.email, roles: user.roles };
      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}