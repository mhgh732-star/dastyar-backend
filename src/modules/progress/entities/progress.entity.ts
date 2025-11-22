import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseEntity } from '../../courses/entities/course.entity';
import { UserEntity } from '../../auth/entities/user.entity';
import { ContentItemEntity } from '../../content/entities/content-item.entity';

export type CompletionType = 'view' | 'time_spent' | 'quiz_passed' | 'assignment_submitted' | 'manual';

@Entity('progress')
@Index(['courseId', 'userId'])
@Index(['courseId', 'contentItemId', 'userId'], { unique: true })
export class ProgressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id', type: 'uuid' })
  courseId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'content_item_id', type: 'uuid', nullable: true })
  contentItemId?: string | null;

  @Column({ name: 'completion_type', type: 'varchar', length: 50, default: 'view' })
  completionType: CompletionType;

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt?: Date | null;

  @Column({ name: 'time_spent', type: 'integer', default: 0 })
  timeSpent: number;

  @Column({ name: 'progress_percentage', type: 'decimal', precision: 5, scale: 2, default: 0 })
  progressPercentage: number;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, any> | null;

  @ManyToOne(() => CourseEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ContentItemEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'content_item_id' })
  contentItem?: ContentItemEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
