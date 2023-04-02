import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { Response } from 'express';
import { MESSAGES } from '@nestjs/core/constants';

@Catch(MongoServerError)
export class MongoException implements ExceptionFilter {
  private readonly logger = new Logger('MONGO-LOGGER');

  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const body =
      exception.code && exception.code === 11000
        ? {
            statusCode: HttpStatus.CONFLICT,
            message: 'This data already exists',
            error: 'Conflict',
          }
        : {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: MESSAGES.UNKNOWN_EXCEPTION_MESSAGE,
          };

    this.logger.error(exception.message, exception.stack);

    res.status(body.statusCode).send(body);
  }
}
