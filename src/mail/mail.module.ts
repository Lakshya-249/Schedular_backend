import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/schema/user.schema';
import { EmailEntity } from './schema/mail.schema';
import { MailController } from './mail.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { EmailCampaignEntity } from './schema/mail-campaigns.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, EmailEntity, EmailCampaignEntity]),
    AuthModule,
    SchedulerModule,
  ],
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule {}
