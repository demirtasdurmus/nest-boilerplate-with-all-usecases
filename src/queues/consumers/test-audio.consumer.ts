/* eslint-disable @typescript-eslint/no-unused-vars */
import { JOB_REF, OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Inject, Scope } from '@nestjs/common';
import { Job } from 'bull';

@Processor({
  name: 'test-queue',
  // scope: Scope.DEFAULT
})
export class TestAudioConsumer {
  // constructor(@Inject(JOB_REF) private jobRef: Job) {}

  @Process()
  async transcode(job: Job<unknown>) {
    let progress = 0;
    for (let i = 0; i < 100; i++) {
      // await doSomething(job.data);
      progress += 1;
      await job.progress(progress);
    }
    return {};
  }

  /* Event Listeners*/
  @OnQueueActive() // handler(job: Job) - Job job has started.
  onActive(job: Job) {
    console.log(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
  }
}
