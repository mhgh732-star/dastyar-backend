import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { CourseEntity } from '../courses/entities/course.entity';
import { CourseEnrollmentEntity } from '../courses/entities/enrollment.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(CourseEntity) private readonly coursesRepository: Repository<CourseEntity>,
    @InjectRepository(CourseEnrollmentEntity)
    private readonly enrollmentsRepository: Repository<CourseEnrollmentEntity>,
  ) {}

  async getDashboardStats() {
    const [users, courses, enrollments] = await Promise.all([
      this.usersRepository.count(),
      this.coursesRepository.count(),
      this.enrollmentsRepository.count(),
    ]);

    return {
      totalUsers: users,
      totalCourses: courses,
      totalEnrollments: enrollments,
    };
  }
}
