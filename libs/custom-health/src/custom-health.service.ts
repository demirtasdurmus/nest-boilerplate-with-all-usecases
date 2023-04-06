import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class CustomHealthService extends HealthIndicator {
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = key === 'healthy';

    const result = this.getStatus(key, isHealthy);

    if (!isHealthy) {
      throw new HealthCheckError('Custom health check failed', result);
    }

    return result;
  }
}
