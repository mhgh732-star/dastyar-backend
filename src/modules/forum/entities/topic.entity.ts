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
import { ForumEntity } from './forum.entity';
import { UserEntity } from '../../auth/entities/user.entity';
import { PostEntity } from './post.entity';
import { TopicSubscriptionEntity } from './topic-subscription.entity';

@Entity('topics')
@Index(['forumId', 'createdAt'])
export class TopicEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'forum_id', type: 'uuid' })
  forumId: string;

  @Column({ name: 'author_id', type: 'uuid' })
  authorId: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'is_pinned', type: 'boolean', default: false })
  isPinned: boolean;

  @Column({ name: 'is_locked', type: 'boolean', default: false })
  isLocked: boolean;

  @Column({ name: 'view_count', type: 'integer', default: 0 })
  viewCount: number;

  @Column({ name: 'reply_count', type: 'integer', default: 0 })
  replyCount: number;

  @Column({ name: 'last_post_at', type: 'timestamp', nullable: true })
  lastPostAt?: Date | null;

  @Column({ name: 'last_post_by', type: 'uuid', nullable: true })
  lastPostById?: string | null;

  @ManyToOne(() => ForumEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'forum_id' })
  forum: ForumEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'last_post_by' })
  lastPostBy?: UserEntity | null;

  @OneToMany(() => PostEntity, (post) => post.topic)
  posts: PostEntity[];

  @OneToMany(() => TopicSubscriptionEntity, (sub) => sub.topic)
  subscriptions: TopicSubscriptionEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

