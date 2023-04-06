/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CacheInterceptor,
  CacheModule,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import { LoggerModule, LoggerService } from '@app/logger';
import { DynamicTestModule } from '@app/dynamic-test';

import { IConfig } from '../config/config.interface';
import { configValidationSchema } from '../config/config.schema';
import { MongoException } from '../filters/mongodb-exception.filter';
import { RolesGuard } from '../guards/roles.guard';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { HttpLogger } from '../middlewares/http-logger.middleware';
import { CLogger, fLogger } from '../middlewares/logger.middleware';
import { VehicleModule } from '../api/vehicle/vehicle.module';
import customConfiguration from '../config/custom-configuration';
import registerAsConfiguration from '../config/register-as-configuration';
import { validate } from '../config/env.validation';
import { MongooseConnectionUtil } from '../utils/mongoose-connection.util';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../guards/auth.guard';
import helmet from 'helmet';
import csurf from 'csurf';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SandboxModule } from './sandbox/sandbox.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    /*CONFIG Module Configuration*/

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      // load: [customConfiguration, registerAsConfiguration],
      cache: true, // improves performance
      validationSchema: configValidationSchema,
      validationOptions: {
        allowUnknown: true, //see https://joi.dev/api/?v=17.8.3#example for more.
        abortEarly: true,
      },
      // validate: validate, // custom .env validator function
      expandVariables: true, // to use variable expansion
    }),

    /*MONGODB Module Configuration*/

    // MongooseModule.forRootAsync({  // using a util class to create the connection
    //   useClass: MongooseConnectionUtil,
    // }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService<IConfig>): MongooseModuleFactoryOptions {
        const logger = new Logger('MONGODB-LOGGER');
        return {
          uri: `mongodb://${config.get('DB_HOST', { infer: true })}:${config.get('DB_PORT', { infer: true })}`,
          socketTimeoutMS: 15000,
          dbName: config.get('DB_NAME', { infer: true }),
          authSource: config.get('DB_AUTHSOURCE', { infer: true }),
          user: config.get('DB_USER', { infer: true }),
          pass: config.get('DB_PASS', { infer: true }),
          connectionFactory(connection: Connection) {
            logger.log(`Connected to ${connection.name} db successfully`);
            return connection;
          },
        };
      },
    }),

    AuthModule,

    UserModule,

    VehicleModule,

    SandboxModule,

    HealthModule,
  ],
  providers: [
    JwtService,

    /*Global Pipes*/
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    },
    {
      provide: APP_FILTER,
      useClass: MongoException,
    },

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    //  we can bind CacheInterceptor to all endpoints globally
    // {
    //   provide: 'APP_INTERCEPTOR',
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CLogger, fLogger)
      .exclude({ path: 'others', method: RequestMethod.GET })
      .forRoutes({ path: 'dynamic', method: RequestMethod.ALL, version: '2' })
      .apply(
        HttpLogger, // Custom Http Logger Middleware
        cookieParser('secret', {}), // Cookie Parser Middleware
        /*
        For high-traffic websites in production, it is strongly recommended to offload 
        compression from the application server - typically in a reverse proxy (e.g., Nginx). 
        In that case, you should not use compression middleware.
        */
        compression(), // Compression Middleware
        helmet(), // Helmet Middleware
        // csurf(), // CSRF Middleware
      )
      .forRoutes('*');
  }
}
