import { UserEntity } from 'src/users/schema/user.schema';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { EmailCampaignEntity } from './mail-campaigns.schema';

export enum EmailStatus {
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

@Entity('emails')
export class EmailEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EmailCampaignEntity, (c) => c.emails)
  campaign: EmailCampaignEntity;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column({ type: 'varchar' })
  fromEmail: string;

  @Column()
  toEmail: string;

  @Column()
  scheduledAt: Date;

  @Column({
    type: 'enum',
    enum: EmailStatus,
    default: EmailStatus.SCHEDULED,
  })
  status: EmailStatus;

  @Column({ nullable: true })
  sentAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
