import { Module } from '@nestjs/common';
import { CookieSessionAuthController } from './cookie-session-auth.controller';
import { CookieSessionAuthService } from './cookie-session-auth.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [CookieSessionAuthController],
  providers: [CookieSessionAuthService],
})
export class CookieSessionAuthModule {}
