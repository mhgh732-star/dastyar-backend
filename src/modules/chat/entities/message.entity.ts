import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';
import { ChatRoomEntity } from './chat-room.entity';
import { MessageReadEntity } from './message-read.entity';

export type MessageType = 'text' | 'file' | 'image' | 'system';

@Entity('messages')
@Index(['roomId', 'createdAt'])
@Index(['senderId', 'createdAt'])
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'room_id', type: 'uuid' })
  roomId: string;

  @Column({ name: 'sender_id', type: 'uuid' })
  senderId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 50, default: 'text' })
  type: MessageType;

  @Column({ name: 'file_url', type: 'varchar', length: 500, nullable: true })
  fileUrl?: string | null;

  @Column({ name: 'file_name', type: 'varchar', length: 255, nullable: true })
  fileName?: string | null;

  @Column({ name: 'file_size', type: 'integer', nullable: true })
  fileSize?: number | null;

  @Column({ name: 'reply_to_id', type: 'uuid', nullable: true })
  replyToId?: string | null;

  @Column({ name: 'is_edited', type: 'boolean', default: false })
  isEdited: boolean;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'simple-json', nullable: true, default: '{}' })
  metadata?: Record<string, any> | null;

  @ManyToOne(() => ChatRoomEntity, (room) => room.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: ChatRoomEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;

  @ManyToOne(() => MessageEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reply_to_id' })
  replyTo?: MessageEntity | null;

  @OneToMany(() => MessageReadEntity, (read) => read.message)
  reads: MessageReadEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
