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
import { UserEntity } from '../../auth/entities/user.entity';
import { CourseEntity } from '../../courses/entities/course.entity';
import { StorageLocationEntity } from './storage-location.entity';

export type FileType = 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
export type StorageProvider = 'local' | 's3' | 'azure' | 'gcs';

@Entity('files')
@Index(['courseId', 'createdAt'])
@Index(['uploadedById', 'createdAt'])
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id', type: 'uuid', nullable: true })
  courseId?: string | null;

  @Column({ name: 'uploaded_by', type: 'uuid' })
  uploadedById: string;

  @Column({ name: 'storage_location_id', type: 'uuid', nullable: true })
  storageLocationId?: string | null;

  @Column({ type: 'varchar', length: 500 })
  filename: string;

  @Column({ type: 'varchar', length: 500 })
  originalFilename: string;

  @Column({ type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ type: 'bigint' })
  fileSize: number;

  @Column({ name: 'file_type', type: 'varchar', length: 50 })
  fileType: FileType;

  @Column({ type: 'varchar', length: 1000 })
  filePath: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  url?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  hash?: string | null;

  @Column({ name: 'is_public', type: 'boolean', default: false })
  isPublic: boolean;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, any> | null;

  @ManyToOne(() => CourseEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'course_id' })
  course?: CourseEntity | null;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy: UserEntity;

  @ManyToOne(() => StorageLocationEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'storage_location_id' })
  storageLocation?: StorageLocationEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
