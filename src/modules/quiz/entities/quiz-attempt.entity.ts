import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuizEntity } from './quiz.entity';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('quiz_attempts')
export class QuizAttemptEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quiz_id', type: 'uuid' })
  quizId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'attempt_number', type: 'integer' })
  attemptNumber: number;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.attempts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz: QuizEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'started_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @Column({ name: 'submitted_at', type: 'timestamp', nullable: true })
  submittedAt?: Date | null;

  @Column({ name: 'time_taken', type: 'integer', nullable: true })
  timeTaken?: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  score?: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  maxScore?: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentage?: number | null;

  @Column({ length: 50, default: 'in_progress' })
  status: string;

  @Column({ type: 'jsonb', default: [] })
  answers: Array<{ questionId: string; choiceIds?: string[]; value?: string }>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
