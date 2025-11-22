import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TopicEntity } from './topic.entity';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('topic_subscriptions')
@Index(['topicId', 'userId'], { unique: true })
export class TopicSubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'topic_id', type: 'uuid' })
  topicId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => TopicEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topic_id' })
  topic: TopicEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;
}

