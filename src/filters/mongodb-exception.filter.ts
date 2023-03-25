import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { Request, Response } from 'express';
import { MESSAGES } from '@nestjs/core/constants';

@Catch(MongoServerError)
export class MongoException implements ExceptionFilter {
  private readonly logger = new Logger('MONGO-LOGGER');

  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const request = ctx.getRequest<Request>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const status = exception.getStatus();

    const body =
      exception.code && exception.code === 11000
        ? {
            statusCode: HttpStatus.CONFLICT,
            message: 'Data already exists',
            error: 'Bad Request',
          }
        : {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: MESSAGES.UNKNOWN_EXCEPTION_MESSAGE,
          };

    this.logger.error(exception.message, exception.stack);

    res.status(body.statusCode).send(body);
  }
}
