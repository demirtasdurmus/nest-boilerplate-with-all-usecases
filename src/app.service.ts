/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  Scope,
} from '@nestjs/common';
import { ModuleRef, REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { STATUS } from './app.controller';
import { DynamicTestService } from '@app/dynamic-test';
import { Cache } from 'cache-manager';
import { Cron, CronExpression, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { TestAudioProducer } from './queues/producers/test-audio.producer';
import { TestScheduleJob } from './jobs/test-schedule.job';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from './events/dispatchers/order-created.event';

@Injectable({
  scope: Scope.DEFAULT, // not necessary actually, others are Scope.REQUEST and Scope.TRANSIENT
})
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  // private service: Service;
  constructor(
    // @Inject(REQUEST) private request: Request, // reaching the request obj in Request scoped provider
    // private readonly moduleRef: ModuleRef,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly eventEmitter: EventEmitter2,
    /* External Providers/Services*/
    private readonly dynamicService: DynamicTestService,
    private readonly jobService: TestScheduleJob,
    private readonly audioService: TestAudioProducer,
  ) {}

  onModuleInit() {
    // console.log('App service have been initialized');
    //   this.service = this.moduleRef.get(Service);
  }

  onApplicationShutdown(signal: string) {
    console.log(signal); // e.g. "SIGINT"
  }

  getData(): { message: string } {
    return { message: 'Welcome!' };
  }

  async testDynamicModule(): Promise<string> {
    return this.dynamicService.getDynamicData();
  }

  async testHttpException() {
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

  async testCache() {
    const value = await this.cacheManager.get('test');

    if (!value) {
      await this.cacheManager.set('test', 'test-cache', 10000);
      return value;
    }

    return value;
  }

  async testSerializeInterceptor() {
    return { id: 1, name: 'test', password: 'secret-pass-not-to-be-exposed' };
  }

  async handleCron() {
    return this.jobService.handleCron();
  }

  async manageCron() {
    return this.jobService.manageCron();
  }

  async testQueue() {
    return this.audioService.addAudioJob({ foo: 'bar' });
  }

  async testEventEmitter() {
    this.eventEmitter.emit('order.created', new OrderCreatedEvent({ foo: 'bar' }));
    return true;
  }
}
