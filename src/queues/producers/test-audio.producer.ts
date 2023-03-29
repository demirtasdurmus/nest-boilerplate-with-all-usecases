import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class TestAudioProducer {
  constructor(@InjectQueue('test-queue') private readonly audioQueue: Queue) {}

  async addAudioJob(data: any) {
    const job = await this.audioQueue.add(
      'test',
      { foo: 'bar' },
      {
        priority: 1, // To prioritize a job
        removeOnComplete: true,
        stackTraceLimit: 10,
        removeOnFail: true,
        timeout: 10000,
        attempts: 3,
        delay: 1000, // 3 seconds delayed
        lifo: true, // To add a job to the right end of the queue
      },
    );
    return job + JSON.stringify(data);
  }
}
