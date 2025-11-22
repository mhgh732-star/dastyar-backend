import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'assignment' | 'quiz' | 'forum' | 'grade' | 'announcement';

@Entity('notifications')
@Index(['userId', 'read'])
@Index(['userId', 'createdAt'])
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', length: 50, default: 'info' })
  type: NotificationType;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @Column({ name: 'read_at', type: 'timestamp', nullable: true })
  readAt?: Date | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  link?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  actionLabel?: string | null;

  @Column({ type: 'simple-json', nullable: true, default: '{}' })
  metadata?: Record<string, any> | null;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
