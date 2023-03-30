import { Injectable } from '@nestjs/common';
import appRootPath from 'app-root-path';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import { formatConsole } from './format-console';

@Injectable()
export class LoggerService {
  private readonly logsRoot: string = `${appRootPath}/logs`;

  createWinstonLogger(appName = 'Nest') {
    return WinstonModule.createLogger({
      transports: [
        this.createErrorFileTransport(appName),
        this.createDebugFileTransport(appName),
        this.createDebugConsoleTransport(appName),
      ],
    });
  }

  private createDebugFileTransport(appName: string) {
    return new transports.File({
      level: 'debug',
      filename: `${this.logsRoot}/${appName.toLowerCase()}-app.log`,
      maxsize: 3145728,
      maxFiles: 10,
      format: format.combine(format.timestamp(), format.json()),
    });
  }

  private createErrorFileTransport(appName: string) {
    return new transports.File({
      level: 'error',
      filename: `${this.logsRoot}/${appName.toLowerCase()}-error.log`,
      maxsize: 3145728,
      maxFiles: 10,
      format: format.combine(format.timestamp(), format.json()),
    });
  }

  private createDebugConsoleTransport(appName = 'Nest') {
    return new transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: format.combine(format.timestamp(), formatConsole(appName)),
    });
  }
}
