import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RolePermissionEntity } from './role-permission.entity';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150 })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'integer', default: 10 })
  level: number;

  @Column({ type: 'boolean', default: false })
  isSystemRole: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RolePermissionEntity, (rp) => rp.role, { cascade: true })
  permissions: RolePermissionEntity[];
}

