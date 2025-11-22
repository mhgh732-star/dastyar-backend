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
import { QuestionEntity } from './question.entity';
import { QuizAttemptEntity } from './quiz-attempt.entity';

@Entity('quizzes')
export class QuizEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id', type: 'uuid' })
  courseId: string;

  @Column({ name: 'content_item_id', type: 'uuid', nullable: true })
  contentItemId?: string | null;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'text', nullable: true })
  instructions?: string | null;

  @Column({ name: 'time_limit', type: 'integer', nullable: true })
  timeLimit?: number | null;

  @Column({ name: 'attempts_allowed', type: 'integer', default: 1 })
  attemptsAllowed: number;

  @Column({ name: 'passing_grade', type: 'decimal', precision: 5, scale: 2, nullable: true })
  passingGrade?: number | null;

  @Column({ name: 'shuffle_questions', type: 'boolean', default: false })
  shuffleQuestions: boolean;

  @Column({ name: 'shuffle_answers', type: 'boolean', default: false })
  shuffleAnswers: boolean;

  @Column({ name: 'show_correct_answers', type: 'boolean', default: true })
  showCorrectAnswers: boolean;

  @Column({ name: 'open_date', type: 'timestamp', nullable: true })
  openDate?: Date | null;

  @Column({ name: 'close_date', type: 'timestamp', nullable: true })
  closeDate?: Date | null;

  @Column({ type: 'simple-json', default: '{}' })
  settings: Record<string, any>;

  @Column({ name: 'created_by', type: 'uuid' })
  createdById: string;

  @ManyToOne(() => CourseEntity, (course) => course.quizzes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @ManyToOne(() => ContentItemEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'content_item_id' })
  contentItem?: ContentItemEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @OneToMany(() => QuestionEntity, (question) => question.quiz, { cascade: true })
  questions: QuestionEntity[];

  @OneToMany(() => QuizAttemptEntity, (attempt) => attempt.quiz)
  attempts: QuizAttemptEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
