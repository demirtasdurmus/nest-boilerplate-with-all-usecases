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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: configValidationSchema,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService<IConfig>): MongooseModuleFactoryOptions {
        const logger = new Logger('MONGODB-LOGGER');
        return {
          uri: `mongodb://${config.get('DB_HOST')}:${config.get('DB_PORT')}`,
          socketTimeoutMS: 15000,
          dbName: config.get('DB_NAME'),
          authSource: config.get('DB_AUTHSOURCE'),
          user: config.get('DB_USER'),
          pass: config.get('DB_PASS'),
          connectionFactory(connection: any) {
            setTimeout(() => {
              logger.verbose(`Connected to ${connection.name} db successfully`);
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
