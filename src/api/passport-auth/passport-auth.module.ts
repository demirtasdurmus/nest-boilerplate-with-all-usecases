import { Module } from '@nestjs/common';
import { PassportAuthService } from './passport-auth.service';
import { UserModule } from '../user/user.module';
import { PassportAuthController } from './passport-auth.controller';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UserModule, PassportAuthModule],
  providers: [PassportAuthService, LocalStrategy],
  controllers: [PassportAuthController],
})
export class PassportAuthModule {}
