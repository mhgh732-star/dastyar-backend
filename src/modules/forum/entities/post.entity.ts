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
import { TopicEntity } from './topic.entity';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('posts')
@Index(['topicId', 'createdAt'])
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'topic_id', type: 'uuid' })
  topicId: string;

  @Column({ name: 'author_id', type: 'uuid', nullable: true })
  authorId?: string | null;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'is_edited', type: 'boolean', default: false })
  isEdited: boolean;

  @Column({ name: 'edited_at', type: 'timestamp', nullable: true })
  editedAt?: Date | null;

  @Column({ name: 'is_anonymous', type: 'boolean', default: false })
  isAnonymous: boolean;

  @ManyToOne(() => TopicEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topic_id' })
  topic: TopicEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'author_id' })
  author?: UserEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
