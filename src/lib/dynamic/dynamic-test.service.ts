import { Injectable } from '@nestjs/common';

@Injectable()
export class DynamicTestService {
  constructor(private readonly arg: string) {}

  public async getDynamicData(): Promise<string> {
    return `This is dynamic: ${this.arg}`;
  }
}
