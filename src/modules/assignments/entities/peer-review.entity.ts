import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SubmissionEntity } from './submission.entity';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('assignment_peer_reviews')
export class PeerReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'submission_id', type: 'uuid' })
  submissionId: string;

  @Column({ name: 'reviewer_id', type: 'uuid' })
  reviewerId: string;

  @ManyToOne(() => SubmissionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'submission_id' })
  submission: SubmissionEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: UserEntity;

  @Column({ name: 'score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  score?: number | null;

  @Column({ type: 'text', nullable: true })
  feedback?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

