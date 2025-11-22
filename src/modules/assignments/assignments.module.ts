import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { AssignmentEntity } from './entities/assignment.entity';
import { SubmissionEntity } from './entities/submission.entity';
import { PeerReviewEntity } from './entities/peer-review.entity';
import { CourseEntity } from '../courses/entities/course.entity';
import { ContentItemEntity } from '../content/entities/content-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssignmentEntity, SubmissionEntity, PeerReviewEntity, CourseEntity, ContentItemEntity])],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}

