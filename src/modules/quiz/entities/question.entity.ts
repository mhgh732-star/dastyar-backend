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
import { QuizEntity } from './quiz.entity';
import { QuestionChoiceEntity } from './question-choice.entity';

@Entity('quiz_questions')
export class QuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quiz_id', type: 'uuid' })
  quizId: string;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz: QuizEntity;

  @Column({ name: 'question_type', type: 'varchar', length: 50 })
  questionType: string;

  @Column({ name: 'question_text', type: 'text' })
  questionText: string;

  @Column({ name: 'question_html', type: 'text', nullable: true })
  questionHtml?: string | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1 })
  points: number;

  @Column({ name: 'difficulty_level', type: 'varchar', length: 20, nullable: true })
  difficultyLevel?: string | null;

  @Column({ type: 'text', nullable: true })
  explanation?: string | null;

  @Column({ name: 'question_order', type: 'integer', nullable: true })
  questionOrder?: number | null;

  @Column({ type: 'simple-json', default: '{}' })
  settings: Record<string, any>;

  @OneToMany(() => QuestionChoiceEntity, (choice) => choice.question, { cascade: true })
  choices: QuestionChoiceEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
