import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignmentEntity } from './entities/assignment.entity';
import { SubmissionEntity } from './entities/submission.entity';
import { PeerReviewEntity } from './entities/peer-review.entity';
import { CreateAssignmentDto, UpdateAssignmentDto } from './dto/create-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeAssignmentDto } from './dto/grade-assignment.dto';
import { CourseEntity } from '../courses/entities/course.entity';
import { ContentItemEntity } from '../content/entities/content-item.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(AssignmentEntity) private readonly assignmentsRepo: Repository<AssignmentEntity>,
    @InjectRepository(SubmissionEntity) private readonly submissionsRepo: Repository<SubmissionEntity>,
    @InjectRepository(PeerReviewEntity) private readonly peerReviewRepo: Repository<PeerReviewEntity>,
    @InjectRepository(CourseEntity) private readonly courseRepo: Repository<CourseEntity>,
    @InjectRepository(ContentItemEntity) private readonly contentRepo: Repository<ContentItemEntity>,
  ) {}

  async listByCourse(courseId: string) {
    await this.ensureCourse(courseId);
    return this.assignmentsRepo.find({ where: { courseId }, order: { dueDate: 'ASC' } });
  }

  async getAssignment(id: string) {
    const assignment = await this.assignmentsRepo.findOne({ where: { id } });
    if (!assignment) throw new NotFoundException('Assignment not found');
    return assignment;
  }

  async createAssignment(courseId: string, dto: CreateAssignmentDto, userId: string) {
    await this.ensureCourse(courseId);
    if (dto.contentItemId) {
      await this.ensureContent(courseId, dto.contentItemId);
    }
    const assignment = this.assignmentsRepo.create({
      courseId,
      contentItemId: dto.contentItemId,
      title: dto.title,
      description: dto.description,
      instructions: dto.instructions,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      cutOffDate: dto.cutOffDate ? new Date(dto.cutOffDate) : undefined,
      maxGrade: dto.maxGrade ?? 100,
      submissionType: dto.submissionType ?? 'online_text',
      maxFileSize: dto.maxFileSize,
      allowedFileTypes: dto.allowedFileTypes,
      allowLateSubmission: dto.allowLateSubmission ?? false,
      enablePeerReview: dto.enablePeerReview ?? false,
      settings: dto.settings ?? {},
      createdById: userId,
    });
    return this.assignmentsRepo.save(assignment);
  }

  async updateAssignment(id: string, dto: UpdateAssignmentDto) {
    const assignment = await this.getAssignment(id);
    if (dto.contentItemId) {
      await this.ensureContent(assignment.courseId, dto.contentItemId);
    }
    Object.assign(assignment, {
      title: dto.title ?? assignment.title,
      description: dto.description ?? assignment.description,
      instructions: dto.instructions ?? assignment.instructions,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : assignment.dueDate,
      cutOffDate: dto.cutOffDate ? new Date(dto.cutOffDate) : assignment.cutOffDate,
      maxGrade: dto.maxGrade ?? assignment.maxGrade,
      submissionType: dto.submissionType ?? assignment.submissionType,
      maxFileSize: dto.maxFileSize ?? assignment.maxFileSize,
      allowedFileTypes: dto.allowedFileTypes ?? assignment.allowedFileTypes,
      allowLateSubmission: dto.allowLateSubmission ?? assignment.allowLateSubmission,
      enablePeerReview: dto.enablePeerReview ?? assignment.enablePeerReview,
      settings: dto.settings ?? assignment.settings,
      contentItemId: dto.contentItemId ?? assignment.contentItemId,
    });
    await this.assignmentsRepo.save(assignment);
    return assignment;
  }

  async deleteAssignment(id: string) {
    const assignment = await this.getAssignment(id);
    await this.assignmentsRepo.remove(assignment);
    return { success: true };
  }

  async submitAssignment(dto: SubmitAssignmentDto, userId: string) {
    const assignment = await this.getAssignment(dto.assignmentId);
    const now = new Date();
    if (assignment.cutOffDate && now > assignment.cutOffDate) {
      throw new BadRequestException('Assignment is closed');
    }
    const lateSubmission = assignment.dueDate ? now > assignment.dueDate : false;
    if (lateSubmission && !assignment.allowLateSubmission) {
      throw new BadRequestException('Late submission is not allowed');
    }
    const submission = this.submissionsRepo.create({
      assignmentId: assignment.id,
      userId,
      submissionText: dto.submissionText,
      fileUrl: dto.fileUrl,
      lateSubmission,
      metadata: {},
    });
    return this.submissionsRepo.save(submission);
  }

  async listSubmissions(assignmentId: string) {
    await this.getAssignment(assignmentId);
    return this.submissionsRepo.find({ where: { assignmentId }, relations: ['user'] });
  }

  async gradeSubmission(dto: GradeAssignmentDto, graderId: string) {
    const submission = await this.submissionsRepo.findOne({ where: { id: dto.submissionId } });
    if (!submission) throw new NotFoundException('Submission not found');
    Object.assign(submission, {
      grade: dto.grade,
      feedback: dto.feedback,
      gradedBy: graderId,
      gradedAt: new Date(),
      status: 'graded',
    });
    await this.submissionsRepo.save(submission);
    return submission;
  }

  private async ensureCourse(courseId: string) {
    const exists = await this.courseRepo.exist({ where: { id: courseId } });
    if (!exists) throw new NotFoundException('Course not found');
  }

  private async ensureContent(courseId: string, contentId: string) {
    const content = await this.contentRepo.findOne({ where: { id: contentId, courseId } });
    if (!content) throw new BadRequestException('Content item does not belong to course');
  }
}

