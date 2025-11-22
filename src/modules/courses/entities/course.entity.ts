import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseSectionEntity } from './course-section.entity';
import { CourseEnrollmentEntity } from './enrollment.entity';
import { UserEntity } from '../../auth/entities/user.entity';
import { CourseActivityEntity } from './activity.entity';
import { QuizEntity } from '../../quiz/entities/quiz.entity';
import { AssignmentEntity } from '../../assignments/entities/assignment.entity';

@Entity('courses')
export class CourseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  fullDescription?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl?: string;

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'simple-json', default: '{}' })
  settings: Record<string, any>;

  @Column({ name: 'created_by', type: 'uuid' })
  createdById: string;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @OneToMany(() => CourseSectionEntity, (section) => section.course, { cascade: true })
  sections: CourseSectionEntity[];

  @OneToMany(() => CourseEnrollmentEntity, (enrollment) => enrollment.course)
  enrollments: CourseEnrollmentEntity[];

  @OneToMany(() => CourseActivityEntity, (activity) => activity.course)
  activities: CourseActivityEntity[];

  @OneToMany(() => QuizEntity, (quiz) => quiz.course)
  quizzes: QuizEntity[];

  @OneToMany(() => AssignmentEntity, (assignment) => assignment.course)
  assignments: AssignmentEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
