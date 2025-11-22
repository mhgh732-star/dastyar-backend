import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ContentItemEntity } from './content-item.entity';

@Entity('content_files')
export class FileMetaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'content_item_id', type: 'uuid' })
  contentItemId: string;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ type: 'varchar', length: 255 })
  mimeType: string;

  @Column({ type: 'varchar', length: 100 })
  storageProvider: string;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ type: 'simple-json', default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => ContentItemEntity, (item) => item.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_item_id' })
  contentItem: ContentItemEntity;
}
