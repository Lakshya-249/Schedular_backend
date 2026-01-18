import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ScheduleEmailDto } from './dto/schedule-email.dto';
import { MailService } from './mail.service';
import type { ModifiedRequest } from 'src/common/types/modified.request';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { ApiDtoResponse } from 'src/common/response/api.response';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('schedule')
  @UseGuards(JwtGuard)
  async schedule(@Body() dto: ScheduleEmailDto, @Req() req: ModifiedRequest) {
    return new ApiDtoResponse(
      200,
      'Email scheduled',
      await this.mailService.scheduleCampaign(req.user.id, dto),
    );
  }

  @Get('scheduled')
  @UseGuards(JwtGuard)
  async getScheduled(@Req() req: ModifiedRequest) {
    return new ApiDtoResponse(
      200,
      'Scheduled emails found',
      await this.mailService.getScheduledEmails(req.user.id),
    );
  }

  @Get('sent')
  @UseGuards(JwtGuard)
  async getSent(@Req() req: ModifiedRequest) {
    return new ApiDtoResponse(
      200,
      'Sent emails found',
      await this.mailService.getSentEmails(req.user.id),
    );
  }
}
