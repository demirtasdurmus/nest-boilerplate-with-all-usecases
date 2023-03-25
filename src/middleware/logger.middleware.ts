import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/* Class middleware
 * consider using this if you need to inject deps
 */
@Injectable()
export class CLogger implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    console.log('Class middleware', req.originalUrl);
    next();
  }
}

/* Functional middleware
 * consider using this if do not need any deps
 */

export function fLogger(req: Request, _res: Response, next: NextFunction): void {
  console.log('Functional middleware', req.originalUrl);
  next();
}
