import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ProgressEntity, CompletionType } from '../entities/progress.entity';
import { CourseEntity } from '../../courses/entities/course.entity';
import { UserEntity } from '../../auth/entities/user.entity';
import { ContentItemEntity } from '../../content/entities/content-item.entity';
import { TrackCompletionDto, GetProgressDto } from '../dto/progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(ProgressEntity) private readonly progressRepo: Repository<ProgressEntity>,
    @InjectRepository(CourseEntity) private readonly courseRepo: Repository<CourseEntity>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(ContentItemEntity) private readonly contentRepo: Repository<ContentItemEntity>,
  ) {}

  async trackCompletion(dto: TrackCompletionDto) {
    await this.ensureCourse(dto.courseId);
    await this.ensureUser(dto.userId);
    if (dto.contentItemId) await this.ensureContent(dto.courseId, dto.contentItemId);

    let progress = await this.progressRepo.findOne({
      where: {
        courseId: dto.courseId,
        userId: dto.userId,
        contentItemId: dto.contentItemId ? dto.contentItemId : IsNull(),
      },
    });

    if (!progress) {
      progress = this.progressRepo.create({
        courseId: dto.courseId,
        userId: dto.userId,
        contentItemId: dto.contentItemId,
        completionType: dto.completionType ?? 'view',
        timeSpent: dto.timeSpent ?? 0,
        progressPercentage: dto.progressPercentage ?? 0,
        metadata: dto.metadata,
      });
    } else {
      progress.timeSpent = (progress.timeSpent ?? 0) + (dto.timeSpent ?? 0);
      if (dto.progressPercentage !== undefined) {
        progress.progressPercentage = Math.max(progress.progressPercentage, dto.progressPercentage);
      }
      if (dto.metadata) {
        progress.metadata = { ...progress.metadata, ...dto.metadata };
      }
    }

    if (dto.completionType === 'view' || progress.progressPercentage >= 100) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
    }

    return this.progressRepo.save(progress);
  }

  async getCourseProgress(courseId: string, userId?: string) {
    await this.ensureCourse(courseId);
    const where: any = { courseId };
    if (userId) where.userId = userId;

    const progressItems = await this.progressRepo.find({
      where,
      relations: ['contentItem', 'user'],
      order: { createdAt: 'DESC' },
    });

    const totalItems = await this.contentRepo.count({ where: { courseId } });
    const completedItems = progressItems.filter((p) => p.isCompleted).length;
    const totalTimeSpent = progressItems.reduce((sum, p) => sum + (p.timeSpent ?? 0), 0);
    const overallCompletion = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    return {
      courseId,
      userId,
      overallCompletion,
      completedActivities: completedItems,
      totalActivities: totalItems,
      timeSpent: totalTimeSpent,
      activities: progressItems.map((p) => ({
        contentItemId: p.contentItemId,
        title: p.contentItem?.title,
        completionType: p.completionType,
        isCompleted: p.isCompleted,
        completedAt: p.completedAt,
        timeSpent: p.timeSpent,
        progressPercentage: p.progressPercentage,
      })),
    };
  }

  async getUserProgressSummary(userId: string) {
    await this.ensureUser(userId);

    const allProgress = await this.progressRepo.find({
      where: { userId },
      relations: ['course', 'contentItem'],
    });

    const byCourse = allProgress.reduce((acc, p) => {
      if (!acc[p.courseId]) {
        acc[p.courseId] = {
          courseId: p.courseId,
          courseTitle: p.course?.title,
          completed: 0,
          total: 0,
          timeSpent: 0,
        };
      }
      if (p.isCompleted) acc[p.courseId].completed++;
      acc[p.courseId].total++;
      acc[p.courseId].timeSpent += p.timeSpent ?? 0;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(byCourse).map((course: any) => ({
      ...course,
      completionPercentage: course.total > 0 ? (course.completed / course.total) * 100 : 0,
    }));
  }

  private async ensureCourse(courseId: string) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  private async ensureUser(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async ensureContent(courseId: string, contentId: string) {
    const content = await this.contentRepo.findOne({ where: { id: contentId, courseId } });
    if (!content) throw new NotFoundException('Content item not found in this course');
    return content;
  }
}
