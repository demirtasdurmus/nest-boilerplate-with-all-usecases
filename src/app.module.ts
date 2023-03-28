/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IConfig } from './config/config.interface';
import { configValidationSchema } from './config/config.schema';
import { MongoException } from './filters/mongodb-exception.filter';
import { RolesGuard } from './guards/roles.guard';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { DynamicTestModule } from './lib/dynamic/dynamic-test.module';
import { HttpLogger } from './middlewares/http-logger.middleware';
import { CLogger, fLogger } from './middlewares/logger.middleware';
import { VehicleModule } from './vehicle/vehicle.module';
import customConfiguration from './config/custom-configuration';
import registerAsConfiguration from './config/register-as-configuration';
import { validate } from './config/env.validation';

@Module({
  imports: [
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
          connectionFactory(connection: any) {
            setTimeout(() => {
              logger.log(`Connected to ${connection.name} db successfully`);
            }, 1000);
            return connection;
          },
        };
      },
    }),
    DynamicTestModule.forRoot({ name: 'first conf value', value: 2 }),
    VehicleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
    {
      provide: APP_FILTER,
      useClass: MongoException,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CLogger, fLogger)
      .exclude({ path: 'others', method: RequestMethod.GET })
      .forRoutes({ path: 'dynamic', method: RequestMethod.ALL })
      .apply(HttpLogger)
      .forRoutes('*');
  }
}
