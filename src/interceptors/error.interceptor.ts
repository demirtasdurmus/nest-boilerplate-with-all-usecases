/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadGatewayException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, of, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // return next.handle().pipe(catchError((err) => of([])));
    return next.handle().pipe(catchError((err) => throwError(() => new BadGatewayException())));
  }
}
