import { Module } from '@nestjs/common';
import { LazyTestService } from './lazy-test.service';

@Module({
  providers: [LazyTestService],
  exports: [LazyTestService],
})
export class LazyTestModule {}
