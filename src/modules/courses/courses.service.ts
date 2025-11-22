import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CourseEntity } from './entities/course.entity';
import { CourseSectionEntity } from './entities/course-section.entity';
import { CourseEnrollmentEntity } from './entities/enrollment.entity';
import { CourseActivityEntity } from './entities/activity.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { EnrollUserDto } from './dto/enroll.dto';
import { CreateSectionDto } from './dto/section.dto';
import { buildPaginationMeta, normalizePagination } from '../../common/utils/pagination.utils';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(CourseEntity) private readonly coursesRepository: Repository<CourseEntity>,
    @InjectRepository(CourseSectionEntity) private readonly sectionsRepository: Repository<CourseSectionEntity>,
    @InjectRepository(CourseEnrollmentEntity)
    private readonly enrollmentsRepository: Repository<CourseEnrollmentEntity>,
    @InjectRepository(CourseActivityEntity) private readonly activitiesRepository: Repository<CourseActivityEntity>,
  ) {}

  async createCourse(dto: CreateCourseDto, createdById: string) {
    const course = this.coursesRepository.create({
      code: dto.code,
      title: dto.title,
      description: dto.description,
      fullDescription: dto.fullDescription,
      imageUrl: dto.imageUrl,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      isPublished: dto.isPublished ?? false,
      createdById,
    });
    await this.coursesRepository.save(course);

    if (dto.sections?.length) {
      await this.sectionsRepository.save(
        dto.sections.map((section, index) =>
          this.sectionsRepository.create({
            courseId: course.id,
            title: section.title,
            description: section.description,
            sectionOrder: section.sectionOrder ?? index + 1,
          }),
        ),
      );
    }

    return this.getCourse(course.id);
  }

  async updateCourse(id: string, dto: UpdateCourseDto) {
    const course = await this.getCourse(id);
    Object.assign(course, {
      title: dto.title ?? course.title,
      description: dto.description ?? course.description,
      fullDescription: dto.fullDescription ?? course.fullDescription,
      imageUrl: dto.imageUrl ?? course.imageUrl,
      startDate: dto.startDate ? new Date(dto.startDate) : course.startDate,
      endDate: dto.endDate ? new Date(dto.endDate) : course.endDate,
      isPublished: dto.isPublished ?? course.isPublished,
    });
    await this.coursesRepository.save(course);
    return this.getCourse(id);
  }

  async listCourses(params: { page?: number; limit?: number; search?: string; isPublished?: boolean }) {
    const pagination = normalizePagination(params);
    let whereClause: Record<string, any>[] | undefined;
    if (params.search) {
      whereClause = [
        { title: ILike(`%${params.search}%`) },
        { code: ILike(`%${params.search}%`) },
      ];
    }
    if (params.isPublished !== undefined && params.isPublished !== null) {
      if (whereClause) {
        whereClause = whereClause.map((condition) => ({ ...condition, isPublished: params.isPublished }));
      } else {
        whereClause = [{ isPublished: params.isPublished }];
      }
    }

    const [items, total] = await this.coursesRepository.findAndCount({
      where: whereClause,
      order: { createdAt: 'DESC' },
      relations: ['sections'],
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    });

    return {
      items,
      meta: buildPaginationMeta(total, pagination),
    };
  }

  async getCourse(id: string) {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['sections', 'enrollments'],
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async enrollUser(courseId: string, dto: EnrollUserDto) {
    await this.getCourse(courseId);
    const enrollment = this.enrollmentsRepository.create({
      courseId,
      userId: dto.userId,
      roleInCourse: dto.roleInCourse ?? 'student',
    });
    return this.enrollmentsRepository.save(enrollment);
  }

  async addSection(courseId: string, dto: CreateSectionDto) {
    await this.getCourse(courseId);
    const section = this.sectionsRepository.create({
      courseId,
      title: dto.title,
      description: dto.description,
      sectionOrder: dto.sectionOrder ?? 1,
    });
    return this.sectionsRepository.save(section);
  }

  async recordActivity(courseId: string, event: string, payload: Record<string, any>, userId?: string) {
    const activity = this.activitiesRepository.create({ courseId, event, payload, userId });
    return this.activitiesRepository.save(activity);
  }
}
