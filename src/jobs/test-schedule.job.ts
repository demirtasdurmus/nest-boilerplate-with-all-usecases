import { SchedulerRegistry } from '@nestjs/schedule';

export class TestScheduleJob {
  constructor(private readonly scheduleRegistry: SchedulerRegistry) {}

  // @Cron('45 * * * * *')
  // @Cron(CronExpression.EVERY_10_SECONDS)
  // @Cron(new Date(Date.now() + 10000), { name: 'test-cron', timeZone: 'Europe/Paris' })
  // @Interval('test', 10000)
  // @Timeout('test', 5000)
  handleCron() {
    console.log('Cron job is running');
  }

  async manageCron() {
    // const job = this.scheduleRegistry.getCronJob('test-cron');
    // console.log(job.lastDate());
    // job.stop();

    // this.scheduleRegistry.addCronJob(
    //   'test-cron-1',
    //   new CronJob('45 * * * * *', () => console.log('Cron job is running')),
    // );

    // this.scheduleRegistry.deleteCronJob('test-cron');

    return this.scheduleRegistry.getCronJobs();
  }
}
