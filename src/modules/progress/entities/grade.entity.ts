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
import { QuizEntity } from '../../quiz/entities/quiz.entity';
import { AssignmentEntity } from '../../assignments/entities/assignment.entity';
import { GradeCategoryEntity } from './grade-category.entity';

@Entity('grades')
@Index(['courseId', 'userId'])
@Index(['courseId', 'gradeItemId', 'gradeItemType'])
export class GradeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id', type: 'uuid' })
  courseId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId?: string | null;

  @Column({ name: 'grade_item_id', type: 'uuid', nullable: true })
  gradeItemId?: string | null;

  @Column({ name: 'grade_item_type', type: 'varchar', length: 50, nullable: true })
  gradeItemType?: 'quiz' | 'assignment' | 'manual' | null;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  grade: number;

  @Column({ name: 'max_grade', type: 'decimal', precision: 5, scale: 2, default: 100 })
  maxGrade: number;

  @Column({ type: 'text', nullable: true })
  feedback?: string | null;

  @Column({ name: 'is_excused', type: 'boolean', default: false })
  isExcused: boolean;

  @Column({ name: 'is_dropped', type: 'boolean', default: false })
  isDropped: boolean;

  @Column({ name: 'graded_by', type: 'uuid', nullable: true })
  gradedById?: string | null;

  @Column({ name: 'graded_at', type: 'timestamp', nullable: true })
  gradedAt?: Date | null;

  @ManyToOne(() => CourseEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => GradeCategoryEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'category_id' })
  category?: GradeCategoryEntity | null;

  @ManyToOne(() => QuizEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'grade_item_id' })
  quiz?: QuizEntity | null;

  @ManyToOne(() => AssignmentEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'grade_item_id' })
  assignment?: AssignmentEntity | null;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'graded_by' })
  gradedBy?: UserEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
