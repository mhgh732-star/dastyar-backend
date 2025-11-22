import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CourseEntity } from './course.entity';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('course_activities')
export class CourseActivityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id', type: 'uuid' })
  courseId: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'varchar', length: 100 })
  event: string;

  @Column({ type: 'simple-json', default: '{}' })
  payload: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => CourseEntity, (course) => course.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
