import { Module } from '@nestjs/common';
import { LazyService } from './lazy.service';

@Module({
  providers: [LazyService],
  exports: [LazyService],
})
export class LazyModule {}
