import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/schema/user.schema';
import { EmailEntity, EmailStatus } from './schema/mail.schema';
import { Repository } from 'typeorm';
import { ScheduleEmailDto } from './dto/schedule-email.dto';
import { SchedulerService } from 'src/scheduler/scheduler.service';
import { EmailCampaignEntity } from './schema/mail-campaigns.schema';

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(EmailEntity)
    private readonly emailRepo: Repository<EmailEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(EmailCampaignEntity)
    private readonly campaignRepo: Repository<EmailCampaignEntity>,

    private readonly schedulerService: SchedulerService,
  ) {}

  async scheduleCampaign(userId: string, dto: ScheduleEmailDto) {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.scheduledAt.getTime() < Date.now()) {
      throw new BadRequestException('Scheduled time must be in the future');
    }

    const campaign = await this.campaignRepo.save({
      user: user,
      fromEmail: user.email,
      subject: dto.subject,
      body: dto.text,
      scheduledAt: dto.scheduledAt,
      delayBetweenEmails: dto.delayBtwEmails,
      hourlyLimit: dto.hourlyLimit,
    });

    const base = dto.scheduledAt.getTime();
    const delayMs = dto.delayBtwEmails * 1000;

    const emails = dto.recipients.map((to, index) =>
      this.emailRepo.create({
        campaign: campaign,
        user: user,
        fromEmail: user.email,
        toEmail: to,
        scheduledAt: new Date(base + index * delayMs),
      }),
    );

    const saved = await this.emailRepo.save(emails);

    for (const email of saved) {
      await this.schedulerService.scheduleEmailJob({
        emailId: email.id,
        scheduledAt: email.scheduledAt,
      });
    }

    return {
      campaignId: campaign.id,
      totalEmails: saved.length,
    };
  }

  async getScheduledEmails(userId: string) {
    return this.emailRepo.find({
      where: {
        user: { id: userId },
        status: EmailStatus.SCHEDULED,
      },
      order: { scheduledAt: 'ASC' },
    });
  }

  async getSentEmails(userId: string) {
    return this.emailRepo.find({
      where: {
        user: { id: userId },
        status: EmailStatus.SENT,
      },
      order: { sentAt: 'DESC' },
    });
  }
}
