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
import { UserEntity } from '../../auth/entities/user.entity';
import { TopicEntity } from './topic.entity';

export type ForumType = 'general' | 'announcement' | 'qna' | 'group';

@Entity('forums')
@Index(['courseId', 'name'], { unique: true })
export class ForumEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id', type: 'uuid' })
  courseId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'forum_type', type: 'varchar', length: 50, default: 'general' })
  forumType: ForumType;

  @Column({ name: 'is_moderated', type: 'boolean', default: false })
  isModerated: boolean;

  @Column({ name: 'allow_anonymous', type: 'boolean', default: false })
  allowAnonymous: boolean;

  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;

  @ManyToOne(() => CourseEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @OneToMany(() => TopicEntity, (topic) => topic.forum)
  topics: TopicEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

