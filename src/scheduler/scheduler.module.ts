import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailEntity } from 'src/mail/schema/mail.schema';
import { EmailSendWorker } from './workers/email-send.worker';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email-scheduler',
    }),
    TypeOrmModule.forFeature([EmailEntity]),
    RedisModule,
  ],
  providers: [SchedulerService, EmailSendWorker],
  exports: [SchedulerService],
})
export class SchedulerModule {}
