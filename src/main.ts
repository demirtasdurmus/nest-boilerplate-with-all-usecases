/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication, Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LazyModuleLoader, NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { IConfig } from './config/config.interface';
import { rainbow } from '@colors/colors/safe';
import { API_PREFIX } from './constants/api-prefix.constant';
import { CustomLogger } from './logger/custom.logger';
import { LoggerService } from '@app/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { VehicleModule } from './api/vehicle/vehicle.module';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule, {
    // logger: false,
    // logger: ['error', 'warn'],
    // logger: console, // use the built-in global JavaScript console object
    // logger: new CustomLogger(), // use a custom logger
    bufferLogs: true,
  });

  /* Set Custom logger as app logger */
  app.useLogger(new LoggerService().createWinstonLogger('VEHICLES'));

  app.enableCors();

  // process.env.NO_COLOR = 'true';  //To disable color in the default logger's messages

  app.setGlobalPrefix(API_PREFIX);

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // TODO: Couldn't get exactly, check this later
  // lazy loading
  // const { LazyModule } = await import('./lib/lazy/lazy.module');
  // const lazyModuleLoader = app.get(LazyModuleLoader);
  // const moduleRef = await lazyModuleLoader.load(() => LazyModule);

  /* Swagger Module Setup */
  const config = new DocumentBuilder()
    .setTitle('Vehicles API')
    .setDescription('The Vehicles API description')
    .setVersion('1.0')
    // .addTag('Vehicles')
    .addCookieAuth('__session-x')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    // include: [AuthModule, UserModule, VehicleModule],
    ignoreGlobalPrefix: true,
  });

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Vehicles API',
    // explorer: true,
  });

  const configService = app.get(ConfigService<IConfig, true>);

  const port = configService.get('APP_PORT', { infer: true });

  await app.listen(port, () => {
    Logger.log(`🚀 ${rainbow(` Application is running on: http://localhost:${port}`)}`);
  });
}
bootstrap();
