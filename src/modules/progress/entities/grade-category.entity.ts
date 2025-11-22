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
import { CourseEntity } from '../../courses/entities/course.entity';
import { GradeEntity } from './grade.entity';

export type AggregationMethod = 'mean' | 'weighted_mean' | 'sum' | 'max' | 'min' | 'median';

@Entity('grade_categories')
@Index(['courseId', 'name'], { unique: true })
export class GradeCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id', type: 'uuid' })
  courseId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'weight', type: 'decimal', precision: 5, scale: 2, default: 0 })
  weight: number;

  @Column({ name: 'aggregation_method', type: 'varchar', length: 50, default: 'mean' })
  aggregationMethod: AggregationMethod;

  @Column({ name: 'drop_lowest', type: 'integer', default: 0 })
  dropLowest: number;

  @Column({ name: 'drop_highest', type: 'integer', default: 0 })
  dropHighest: number;

  @Column({ name: 'item_order', type: 'integer', default: 0 })
  itemOrder: number;

  @ManyToOne(() => CourseEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @OneToMany(() => GradeEntity, (grade) => grade.category)
  grades: GradeEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

