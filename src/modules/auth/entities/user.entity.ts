import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { UserProfileEntity } from '../../users/entities/user-profile.entity';
import { UserSettingsEntity } from '../../users/entities/user-settings.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 190 })
  email: string;

  @Column({ type: 'varchar', length: 190 })
  firstName: string;

  @Column({ type: 'varchar', length: 190 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'simple-array', default: 'student' })
  roles: string[];

  @Column({ type: 'boolean', default: false })
  mfaEnabled: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mfaSecret?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserProfileEntity, (profile) => profile.user)
  profile?: UserProfileEntity;

  @OneToOne(() => UserSettingsEntity, (settings) => settings.user)
  settings?: UserSettingsEntity;
}
