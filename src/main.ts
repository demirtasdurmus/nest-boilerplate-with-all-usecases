/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LazyModuleLoader, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IConfig } from './config/config.interface';
import { rainbow } from '@colors/colors/safe';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule);

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
