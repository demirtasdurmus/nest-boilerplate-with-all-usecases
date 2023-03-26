/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication } from '@nestjs/common';
import { LazyModuleLoader, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule);

  // TODO: Couldn't get exactly, check this later
  // lazy loading
  // const { LazyModule } = await import('./lib/lazy/lazy.module');
  // const lazyModuleLoader = app.get(LazyModuleLoader);
  // const moduleRef = await lazyModuleLoader.load(() => LazyModule);

  await app.listen(8000);
}
bootstrap();
