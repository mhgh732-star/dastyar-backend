import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionEntity } from './question.entity';

@Entity('quiz_question_choices')
export class QuestionChoiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'question_id', type: 'uuid' })
  questionId: string;

  @ManyToOne(() => QuestionEntity, (question) => question.choices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: QuestionEntity;

  @Column({ name: 'option_text', type: 'text' })
  optionText: string;

  @Column({ name: 'is_correct', type: 'boolean', default: false })
  isCorrect: boolean;

  @Column({ name: 'option_order', type: 'integer', default: 1 })
  optionOrder: number;

  @Column({ type: 'text', nullable: true })
  feedback?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
