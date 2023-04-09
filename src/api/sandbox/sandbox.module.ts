/* eslint-disable @typescript-eslint/no-unused-vars */
import { CacheModule, Module } from '@nestjs/common';
import { SandboxService } from './sandbox.service';
import { SandboxController } from './sandbox.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MulterModule } from '@nestjs/platform-express';
import { DynamicTestModule } from '@app/dynamic-test';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerModule } from '@nestjs/throttler';
import { TestScheduleJob } from 'src/jobs/test-schedule.job';
import { TestAudioProducer } from 'src/queues/producers/test-audio.producer';
import { TestAudioConsumer } from 'src/queues/consumers/test-audio.consumer';
import { OrderCreatedListener } from 'src/events/listeners/order-created.listener';
import { JwtService } from '@nestjs/jwt';
import { ClsModule, ClsService } from 'nestjs-cls';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { BcryptService } from '@app/bcrypt';

@Module({
  imports: [
    /*CACHE Module Configuration*/

    // CacheModule.registerAsync({ // using a util class to create the connection
    //   useClass: CacheConfigService,
    // }),
    CacheModule.register({
      isGlobal: true,
      ttl: 5, // seconds
      max: 10, // maximum number of items in cache
    }),

    /* Task Schedule Module Configuration*/

    ScheduleModule.forRoot(),

    /*QUEUE Module Configuration*/

    // BullModule.forRoot({
    //   redis: {
    //     host: 'localhost',
    //     port: 6379,
    //   },
    // }),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'test-queue',
    }),

    /* Events Module Configuration */

    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),

    /* File Upload Module */
    MulterModule.registerAsync({
      useFactory: () => ({
        // dest: './upload',
      }),
    }),

    /* Dynamic Module Configuration */
    DynamicTestModule.forRoot({ name: 'first conf value', value: 2 }),

    /* HTTP Module*/
    // HttpModule.register({
    //   timeout: 5000,
    //   maxRedirects: 5,
    // }),

    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),

    /* Rate Limit */
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    // ThrottlerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     ttl: config.get('THROTTLE_TTL'),
    //     limit: config.get('THROTTLE_LIMIT'),
    //   }),
    // }),

    /* CLS Module Configuration */
    ClsModule.forRoot({
      middleware: {
        // automatically mount the
        // ClsMiddleware for all routes
        mount: true,
        // and use the setup method to
        // provide default store values.
        setup: (cls: ClsService<{ protocol: string }>, req: Request, _res: Response) => {
          cls.set('protocol', req.protocol);
        },
      },
    }),
  ],
  controllers: [SandboxController],
  providers: [
    SandboxService,

    /* Consumer and Producer providers */
    TestAudioProducer,
    TestAudioConsumer,

    /* Schedule providers */
    TestScheduleJob,

    /* Event Emitter Listener Providers */
    OrderCreatedListener,

    JwtService,
  ],
})
export class SandboxModule {}
