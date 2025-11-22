import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseEntity } from '../../courses/entities/course.entity';
import { ContentItemEntity } from '../../content/entities/content-item.entity';
import { UserEntity } from '../../auth/entities/user.entity';
import { SubmissionEntity } from './submission.entity';

@Entity('assignments')
export class AssignmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id', type: 'uuid' })
  courseId: string;

  @Column({ name: 'content_item_id', type: 'uuid', nullable: true })
  contentItemId?: string | null;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  instructions?: string;

  @Column({ name: 'due_date', type: 'timestamp', nullable: true })
  dueDate?: Date | null;

  @Column({ name: 'cut_off_date', type: 'timestamp', nullable: true })
  cutOffDate?: Date | null;

  @Column({ name: 'max_grade', type: 'decimal', precision: 5, scale: 2, default: 100 })
  maxGrade: number;

  @Column({ name: 'submission_type', type: 'varchar', length: 50, default: 'online_text' })
  submissionType: string;

  @Column({ name: 'max_file_size', type: 'integer', nullable: true })
  maxFileSize?: number | null;

  @Column({ name: 'allowed_file_types', type: 'varchar', length: 255, nullable: true })
  allowedFileTypes?: string | null;

  @Column({ name: 'allow_late_submission', type: 'boolean', default: false })
  allowLateSubmission: boolean;

  @Column({ name: 'enable_peer_review', type: 'boolean', default: false })
  enablePeerReview: boolean;

  @Column({ type: 'simple-json', default: '{}' })
  settings: Record<string, any>;

  @Column({ name: 'created_by', type: 'uuid' })
  createdById: string;

  @ManyToOne(() => CourseEntity, (course) => course.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @ManyToOne(() => ContentItemEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'content_item_id' })
  contentItem?: ContentItemEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @OneToMany(() => SubmissionEntity, (submission) => submission.assignment)
  submissions: SubmissionEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

