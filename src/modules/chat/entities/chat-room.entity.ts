import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';
import { CourseEntity } from '../../courses/entities/course.entity';
import { MessageEntity } from './message.entity';

export type ChatRoomType = 'course' | 'private' | 'group';

@Entity('chat_rooms')
@Index(['courseId', 'type'])
export class ChatRoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'varchar', length: 50, default: 'course' })
  type: ChatRoomType;

  @Column({ name: 'course_id', type: 'uuid', nullable: true })
  courseId?: string | null;

  @Column({ name: 'created_by', type: 'uuid' })
  createdById: string;

  @Column({ name: 'is_private', type: 'boolean', default: false })
  isPrivate: boolean;

  @Column({ name: 'is_archived', type: 'boolean', default: false })
  isArchived: boolean;

  @Column({ type: 'simple-json', nullable: true, default: '{}' })
  metadata?: Record<string, any> | null;

  @ManyToOne(() => CourseEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'course_id' })
  course?: CourseEntity | null;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user)
  @JoinTable({
    name: 'chat_room_participants',
    joinColumn: { name: 'room_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  participants: UserEntity[];

  @OneToMany(() => MessageEntity, (message) => message.room)
  messages: MessageEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
