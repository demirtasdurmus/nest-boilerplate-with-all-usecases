import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CookieSessionAuthController } from './cookie-session-auth.controller';
import { CookieSessionAuthService } from './cookie-session-auth.service';
import { UserModule } from '../user/user.module';
import { ConfigService } from '@nestjs/config';
import { IConfig } from '../../config/config.interface';
import cookieSession from 'cookie-session';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
// import csurf from 'csurf';

@Module({
  imports: [UserModule],
  controllers: [CookieSessionAuthController],
  providers: [CookieSessionAuthService],
})
export class CookieSessionAuthModule implements NestModule {
  constructor(private readonly config: ConfigService<IConfig, true>) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      /* Cookie Session Middleware & Current User Middleware */
      .apply(
        cookieSession({
          name: this.config.get('AUTH_COOKIE_NAME', { infer: true }),
          keys: [this.config.get('JWT_SECRET', { infer: true })],
          maxAge:
            Number(this.config.get('JWT_EXPIRES_IN', { infer: true }).split('').slice(0, -1).join('')) *
            24 *
            60 *
            60 *
            1000,
        }),
        CurrentUserMiddleware,
      )
      .forRoutes('*cookie-session-auth*');

    /* CSRF Middleware */
    // .apply(csurf({ cookie: true }))
    // .forRoutes('*cookie-session-auth*');
  }
}
