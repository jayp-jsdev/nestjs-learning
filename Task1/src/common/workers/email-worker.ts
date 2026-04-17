import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { mailType } from '../../lib/type';

@Processor('email-queue')
export class EmailWorker extends WorkerHost {
  constructor(private mailService: MailerService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { to, subject, html } = job.data as mailType;

    console.log('Processing job:', job.name, 'with data:', job.data);
    await this.mailService.sendMail({
      from: 'jayp.jsdev@gmail.com',
      to,
      subject,
      html,
    });

    return { success: true };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job completed: ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.error(`Job failed: ${job.id}`, err.message);
  }
}
