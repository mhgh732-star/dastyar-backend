import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseEntity } from '../../courses/entities/course.entity';
import { CourseSectionEntity } from '../../courses/entities/course-section.entity';
import { UserEntity } from '../../auth/entities/user.entity';
import { FileMetaEntity } from './file-meta.entity';
import { PageEntity } from './page.entity';

@Entity('content_items')
@Index(['courseId', 'itemOrder'])
export class ContentItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id', type: 'uuid' })
  courseId: string;

  @Column({ name: 'section_id', type: 'uuid', nullable: true })
  sectionId?: string | null;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'content_type', type: 'varchar', length: 50 })
  contentType: string;

  @Column({ name: 'content_body', type: 'text', nullable: true })
  contentBody?: string | null;

  @Column({ name: 'resource_url', type: 'varchar', length: 500, nullable: true })
  resourceUrl?: string | null;

  @Column({ name: 'item_order', type: 'int', default: 1 })
  itemOrder: number;

  @Column({ name: 'is_visible', type: 'boolean', default: true })
  isVisible: boolean;

  @Column({ type: 'simple-json', default: '{}' })
  settings: Record<string, any>;

  @Column({ name: 'created_by', type: 'uuid' })
  createdById: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;

  @ManyToOne(() => CourseEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @ManyToOne(() => CourseSectionEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'section_id' })
  section?: CourseSectionEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @OneToMany(() => FileMetaEntity, (file) => file.contentItem, { cascade: true })
  files: FileMetaEntity[];

  @OneToOne(() => PageEntity, (page) => page.contentItem, { cascade: true })
  page: PageEntity;
}
