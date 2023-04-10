import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { BcryptService } from '@app/bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { IJwtData } from '../../interfaces/jwt.interface';

@Injectable()
export class CookieSessionAuthService {
  constructor(private readonly userService: UserService, private readonly bcryptService: BcryptService) {}

  async login(loginDto: LoginUserDto): Promise<IJwtData> {
    const user = await this.userService.findByEmail(loginDto.email);

    if (user && (await this.bcryptService.compare(loginDto.password, user.password))) {
      return { id: user.id };
    }

    throw new BadRequestException('Invalid credentials');
  }
}
