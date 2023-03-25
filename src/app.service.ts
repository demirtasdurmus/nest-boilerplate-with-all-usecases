import { Injectable } from '@nestjs/common';
import { DynamicTestService } from './lib/dynamic-test.service';

@Injectable()
export class AppService {
  constructor(private readonly dynamicService: DynamicTestService) {}

  getData(): { message: string } {
    return { message: 'Welcome to uback!' };
  }

  async testDynamicModule(): Promise<string> {
    return this.dynamicService.getDynamicData();
  }
}
