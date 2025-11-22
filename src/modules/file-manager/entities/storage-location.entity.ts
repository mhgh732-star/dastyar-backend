import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileEntity } from './file.entity';

export type StorageProvider = 'local' | 's3' | 'azure' | 'gcs';

@Entity('storage_locations')
@Index(['name'], { unique: true })
export class StorageLocationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  provider: StorageProvider;

  @Column({ type: 'varchar', length: 1000 })
  basePath: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  endpoint?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bucket?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  region?: string | null;

  @Column({ type: 'simple-json', nullable: true })
  credentials?: Record<string, any> | null;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => FileEntity, (file) => file.storageLocation)
  files: FileEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
