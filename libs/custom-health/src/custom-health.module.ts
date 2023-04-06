import { Module } from '@nestjs/common';
import { CustomHealthService } from './custom-health.service';

@Module({
  providers: [CustomHealthService],
  exports: [CustomHealthService],
})
export class CustomHealthModule {}
