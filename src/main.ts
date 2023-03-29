/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication, Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LazyModuleLoader, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IConfig } from './config/config.interface';
import { rainbow } from '@colors/colors/safe';
import { API_PREFIX } from './constants/api-prefix.constant';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule);

  app.setGlobalPrefix(API_PREFIX);

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // TODO: Couldn't get exactly, check this later
  // lazy loading
  // const { LazyModule } = await import('./lib/lazy/lazy.module');
  // const lazyModuleLoader = app.get(LazyModuleLoader);
  // const moduleRef = await lazyModuleLoader.load(() => LazyModule);

  const configService = app.get(ConfigService<IConfig, true>);

  const port = configService.get('APP_PORT', { infer: true });

  await app.listen(port, () => {
    Logger.log(`🚀 ${rainbow(` Application is running on: http://localhost:${port}`)}`);
  });
}
bootstrap();
