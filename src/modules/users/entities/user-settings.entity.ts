import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('user_settings')
export class UserSettingsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'boolean', default: true })
  emailNotificationsEnabled: boolean;

  @Column({ type: 'boolean', default: true })
  pushNotificationsEnabled: boolean;

  @Column({ type: 'varchar', length: 20, default: 'light' })
  theme: 'light' | 'dark';

  @Column({ type: 'varchar', length: 5, default: 'fa' })
  locale: string;

  @Column({ type: 'simple-json', default: '{}' })
  preferences: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
