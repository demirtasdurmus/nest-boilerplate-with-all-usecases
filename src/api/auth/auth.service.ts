import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '@app/bcrypt/bcrypt.service';
import { IJwtData } from '../../interfaces/jwt.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const user = await this.userService.findByEmail(loginUserDto.email);

    if (user && (await this.bcryptService.compare(loginUserDto.password, user.password))) {
      const data: IJwtData = { id: user.id };

      const accessToken = await this.jwtService.signAsync(data);

      return { accessToken };
    }

    throw new BadRequestException('Invalid credentials');
  }
}
