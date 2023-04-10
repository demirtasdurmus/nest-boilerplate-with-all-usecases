import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { PassportAuthService } from '../passport-auth.service';
import { IJwtData } from '../../../interfaces/jwt.interface';
import { LOCAL_STRATEGY } from '../constants/local-strategy.constant';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LOCAL_STRATEGY) {
  constructor(private readonly authService: PassportAuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<IJwtData> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    return { id: user.id };
  }
}
