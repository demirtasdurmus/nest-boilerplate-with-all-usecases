import { Inject, Injectable } from '@nestjs/common';
import { TEST_OPTIONS } from './options.constant';

@Injectable()
export class DynamicTestService {
  constructor(@Inject(TEST_OPTIONS) private readonly testOptions: object) {}

  public async getDynamicData(): Promise<string> {
    return `These are dynamic module option keys : ${Object.keys(this.testOptions)}`;
  }
}
