import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DynamicTestService } from './lib/dynamic/dynamic-test.service';

@Injectable()
export class AppService {
  constructor(private readonly dynamicService: DynamicTestService) {}

  getData(): { message: string } {
    return { message: 'Welcome to uback!' };
  }

  async testDynamicModule(): Promise<string> {
    return this.dynamicService.getDynamicData();
  }

  async testHttpExeption() {
    throw new HttpException(
      { status: HttpStatus.BAD_REQUEST, error: 'This is a custom error message' },
      HttpStatus.BAD_REQUEST,
      { cause: new Error('Custom error with cause'), description: 'Some error description' },
    );
  }
}
