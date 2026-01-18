import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import Redis from 'ioredis';

import { EmailEntity, EmailStatus } from 'src/mail/schema/mail.schema';
import { REDIS_CLIENT } from 'src/redis/redis.provider';

import nodemailer from 'nodemailer';
import { createEtherealTransporter } from 'src/mail/mailer';

@Processor('email-scheduler')
export class EmailSendWorker extends WorkerHost {
  private transporter: nodemailer.Transporter | null = null;
  constructor(
    @InjectRepository(EmailEntity)
    private readonly emailRepo: Repository<EmailEntity>,

    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {
    super();
    console.log('EmailSendWorker started');
  }

  async process(job: Job<{ emailId: string }>) {
    const { emailId } = job.data;

    const email = await this.emailRepo.findOne({
      where: { id: emailId },
      relations: ['campaign'],
    });

    if (!email) return;

    if (email.status === EmailStatus.SENT) return;

    const sender = email.fromEmail.toLowerCase();
    const hourKey = this.getHourKey(sender);

    const sentCount = await this.redis.incr(hourKey);

    if (sentCount === 1) {
      await this.redis.expire(hourKey, 3600);
    }

    if (sentCount > email.campaign.hourlyLimit) {
      const delay = this.msUntilNextHour();
      console.log(`Hourly limit hit for ${sender}, delaying ${delay}ms`);

      await job.moveToDelayed(Date.now() + delay);
      return;
    }

    console.log(`Sending email to ${email.toEmail}`);

    if (!this.transporter) {
      const ethereal = await createEtherealTransporter();
      this.transporter = ethereal.transporter;
    }

    const info = await this.transporter.sendMail({
      from: email.fromEmail,
      to: email.toEmail,
      subject: email.campaign.subject,
      html: email.campaign.body,
      text: email.campaign.body,
    });

    console.log('Email sent');
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

    email.status = EmailStatus.SENT;
    email.sentAt = new Date();
    await this.emailRepo.save(email);

    console.log(`Email ${email.id} sent`);
  }

  private getHourKey(sender: string) {
    const now = new Date();
    const hour = now.toISOString().slice(0, 13);
    return `email_rate:sender:${sender}:${hour}`;
  }

  private msUntilNextHour(): number {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setMinutes(60, 0, 0);
    return nextHour.getTime() - now.getTime();
  }
}
