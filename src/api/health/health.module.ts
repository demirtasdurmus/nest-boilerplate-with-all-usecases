import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { CustomHealthModule } from '@app/custom-health';

@Module({
  imports: [
    TerminusModule.forRoot({
      errorLogStyle: 'pretty',
      // logger: myCustomLogger,
    }),
    CustomHealthModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
