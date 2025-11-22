import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ContentItemEntity } from './content-item.entity';

@Entity('content_pages')
export class PageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'content_item_id', type: 'uuid', unique: true })
  contentItemId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'simple-json', default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => ContentItemEntity, (content) => content.page, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_item_id' })
  contentItem: ContentItemEntity;
}
