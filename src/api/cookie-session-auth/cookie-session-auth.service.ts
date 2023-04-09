import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { BcryptService } from '@app/bcrypt';
import { UserRole } from '../user/interfaces/user.interface';
import { LoginUserDto } from './dto/login-user.dto';

export interface IAuthUser {
  email: string;
  roles: UserRole[];
}

@Injectable()
export class CookieSessionAuthService {
  constructor(private readonly userService: UserService, private readonly bcryptService: BcryptService) {}

  async login(loginDto: LoginUserDto): Promise<IAuthUser> {
    const user = await this.userService.findByEmail(loginDto.email);

    if (user && (await this.bcryptService.compare(loginDto.password, user.password))) {
      const authUser = { email: user.email, roles: user.roles };
      return authUser;
    }

    throw new BadRequestException('Invalid credentials');
  }
}
