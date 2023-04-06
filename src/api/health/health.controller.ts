import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../../decorators/public.decorator';
import { CustomHealthService } from '@app/custom-health';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly mongo: MongooseHealthIndicator,
    private readonly custom: CustomHealthService,
  ) {}

  @Get('http')
  @Public()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    // return this.health.check([
    //   () => this.http.responseCheck('my-external-service', 'https://google.com', (res) => res.status === 204),
    // ]);
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      // () => this.http.pingCheck('google', 'https://google.com'),
    ]);
  }

  @Get('disk')
  @Public()
  @HealthCheck()
  checkDisk(): Promise<HealthCheckResult> {
    return this.health.check([
      // () => this.disk.checkStorage('storage', { thresholdPercent: 0.5, path: '/' }),
      () => this.disk.checkStorage('storage', { path: '/', threshold: 250 * 1024 * 1024 * 1024 }),
    ]);
  }

  @Get('memory')
  @Public()
  @HealthCheck()
  checkMemory(): Promise<HealthCheckResult> {
    return this.health.check([
      // () => this.memory.checkRSS('memory_rss', 100 * 1024 * 1024), // how much memory is allocated to that process and is in RAM
      () => this.memory.checkHeap('memory_heap', 100 * 1024 * 1024), // usage should be less than 10MB
    ]);
  }

  @Get('mongo')
  @Public()
  @HealthCheck()
  checkMongo(): Promise<HealthCheckResult> {
    return this.health.check([() => this.mongo.pingCheck('mongodb', { timeout: 1500 })]);
  }

  @Get('custom')
  @Public()
  @HealthCheck()
  checkCustom(): Promise<HealthCheckResult> {
    return this.health.check([
      // () => this.custom.isHealthy('unHealthy'),
      () => this.custom.isHealthy('healthy'),
    ]);
  }
}
