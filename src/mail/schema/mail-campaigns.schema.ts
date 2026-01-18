import { UserEntity } from 'src/users/schema/user.schema';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmailEntity } from './mail.schema';

@Entity('email_campaigns')
export class EmailCampaignEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column()
  fromEmail: string;

  @Column('text')
  subject: string;

  @Column('text')
  body: string;

  @Column()
  scheduledAt: Date;

  @Column({ type: 'int' })
  delayBetweenEmails: number;

  @Column({ type: 'int' })
  hourlyLimit: number;

  @OneToMany(() => EmailEntity, (email) => email.campaign)
  emails: EmailEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
