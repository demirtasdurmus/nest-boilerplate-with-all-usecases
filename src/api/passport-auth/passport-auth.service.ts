import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { BcryptService } from '@app/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IJwtData } from '../../interfaces/jwt.interface';
import { IUser } from '../user/interfaces/user.interface';

@Injectable()
export class PassportAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<IUser | null> {
    const user = await this.userService.findByEmail(email);

    if (user && (await this.bcryptService.compare(pass, user.password))) {
      return user;
    }

    return null;
  }

  async createAccessToken(data: IJwtData): Promise<string> {
    return this.jwtService.sign(data);
  }
}
