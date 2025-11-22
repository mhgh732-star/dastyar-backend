import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AssignmentEntity } from './assignment.entity';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('assignment_submissions')
export class SubmissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'assignment_id', type: 'uuid' })
  assignmentId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => AssignmentEntity, (assignment) => assignment.submissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignment_id' })
  assignment: AssignmentEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'submission_text', type: 'text', nullable: true })
  submissionText?: string | null;

  @Column({ name: 'file_url', type: 'varchar', length: 500, nullable: true })
  fileUrl?: string | null;

  @Column({ name: 'status', type: 'varchar', length: 50, default: 'submitted' })
  status: string;

  @Column({ name: 'grade', type: 'decimal', precision: 5, scale: 2, nullable: true })
  grade?: number | null;

  @Column({ name: 'graded_by', type: 'uuid', nullable: true })
  gradedBy?: string | null;

  @Column({ name: 'graded_at', type: 'timestamp', nullable: true })
  gradedAt?: Date | null;

  @Column({ type: 'text', nullable: true })
  feedback?: string | null;

  @Column({ name: 'late_submission', type: 'boolean', default: false })
  lateSubmission: boolean;

  @Column({ type: 'simple-json', default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'submitted_at' })
  submittedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

