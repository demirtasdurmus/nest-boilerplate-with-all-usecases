import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { STATUS } from './app.controller';
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

  async testParsePipe(id: string, status: STATUS) {
    return 'Reached service level:' + id + status;
  }

  async testJoiValidationPipe(data: any) {
    return data;
  }
}
