import { Module } from '@nestjs/common';
import { PassportAuthService } from './passport-auth.service';
import { UserModule } from '../user/user.module';
import { PassportAuthController } from './passport-auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IConfig } from 'src/config/config.interface';
import { JwtBearerStrategy } from './strategies/jwt-bearer.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtCookieStrategy } from './strategies/jwt-cookie.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      // session: true,
    }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService<IConfig, true>): JwtModuleOptions => ({
        secret: config.get('JWT_SECRET', { infer: true }),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_IN', { infer: true }),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [PassportAuthService, LocalStrategy, JwtBearerStrategy, JwtCookieStrategy],
  controllers: [PassportAuthController],
})
export class PassportAuthModule {}
