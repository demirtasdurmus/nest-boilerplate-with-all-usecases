import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { BcryptService } from '@app/bcrypt';
import { UserRole } from '../user/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';

export interface IAuthUser {
  email: string;
  roles: UserRole[];
}

@Injectable()
export class PassportAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<IAuthUser | null> {
    const user = await this.userService.findByEmail(email);

    if (user && (await this.bcryptService.compare(pass, user.password))) {
      const authUser = { email: user.email, roles: user.roles };
      return authUser;
    }

    return null;
  }

  async createAccessToken(user: IAuthUser) {
    return this.jwtService.sign(user);
  }
}
