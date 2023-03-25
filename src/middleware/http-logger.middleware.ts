import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HttpLogger implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const timestamp = new Date().toUTCString();

    const { ip, method, originalUrl, protocol, httpVersion } = req;

    const userAgent = req.get('user-agent') || '';

    const reqProtocol = `${protocol.toUpperCase()}/${httpVersion}`;

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || 0;

      const message = `${ip} - [${timestamp}] - ${method} - ${originalUrl} - ${reqProtocol} - ${statusCode} - ${contentLength} - ${userAgent}`;

      this.logger.log(message);
    });

    next();
  }
}
