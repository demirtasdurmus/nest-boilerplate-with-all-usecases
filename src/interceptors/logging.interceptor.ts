import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    console.log('Im logging before call handler is called: interceptor' + req.originalUrl);

    const now = Date.now();

    return next
      .handle()
      .pipe(tap(() => console.log('Im logging after handler is called: interceptor Time:' + `${Date.now() - now}`)));
  }
}
