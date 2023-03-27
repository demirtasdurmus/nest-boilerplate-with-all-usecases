/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { ModuleRef, REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { STATUS } from './app.controller';
import { DynamicTestService } from './lib/dynamic/dynamic-test.service';

@Injectable({
  scope: Scope.DEFAULT, // not necessary actually, others are Scope.REQUEST and Scope.TRANSIENT
})
export class AppService implements OnModuleInit {
  // private service: Service;
  constructor(
    // @Inject(REQUEST) private request: Request, // reaching the request obj in Request scoped provider
    // private readonly moduleRef: ModuleRef,
    private readonly dynamicService: DynamicTestService,
  ) {}

  onModuleInit() {
    // console.log('App service have been initialized');
    //   this.service = this.moduleRef.get(Service);
  }

  onApplicationShutdown(signal: string) {
    console.log(signal); // e.g. "SIGINT"
  }

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

  async testRoleGuard(data: any) {
    return data;
  }
}
