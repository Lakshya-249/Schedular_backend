import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectQueue('email-scheduler')
    private readonly emailQueue: Queue,
  ) {}

  async scheduleEmailJob(params: { emailId: string; scheduledAt: Date }) {
    const delay = params.scheduledAt.getTime() - Date.now();

    console.log('Delay: ', delay);

    await this.emailQueue.add(
      'send-email',
      {
        emailId: params.emailId,
      },
      {
        delay,
        jobId: params.emailId,
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }
}
