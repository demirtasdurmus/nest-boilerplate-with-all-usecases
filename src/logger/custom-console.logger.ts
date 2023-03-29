/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConsoleLogger } from '@nestjs/common';

export class MyLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    // add your tailored logic here
    // super.error(...arguments);
  }
}
