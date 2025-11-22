import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './controllers/courses.controller';
import { CoursesService } from './courses.service';
import { CourseEntity } from './entities/course.entity';
import { CourseSectionEntity } from './entities/course-section.entity';
import { CourseEnrollmentEntity } from './entities/enrollment.entity';
import { CourseActivityEntity } from './entities/activity.entity';
import { CoursesRepository } from './courses.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity, CourseSectionEntity, CourseEnrollmentEntity, CourseActivityEntity])],
  controllers: [CoursesController],
  providers: [CoursesService, CoursesRepository],
  exports: [CoursesService],
})
export class CoursesModule {}
