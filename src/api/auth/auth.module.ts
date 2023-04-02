import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IConfig } from 'src/config/config.interface';
import { BcryptModule } from '@app/bcrypt';

@Module({
  imports: [
    UserModule,
    BcryptModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<IConfig, true>) => ({
        saltRounds: config.get('BCRYPT_SALT_ROUNDS', { infer: true }),
      }),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<IConfig, true>) => ({
        global: true,
        signOptions: { expiresIn: '600s' },
        secret: config.get('JWT_SECRET', { infer: true }),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
