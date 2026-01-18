import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ScheduleEmailDto {
  @IsArray()
  @IsEmail({}, { each: true, message: 'Each recipient must be a valid email' })
  recipients: string[];

  @IsString({ message: 'Subject is required' })
  subject: string;

  @IsString({ message: 'Text is required' })
  text: string;

  @Type(() => Date)
  @IsDate()
  scheduledAt: Date;

  @IsOptional()
  @Type(() => Number)
  @IsInt({})
  delayBtwEmails: number = 2;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10000)
  @IsOptional()
  hourlyLimit: number = 200;
}
