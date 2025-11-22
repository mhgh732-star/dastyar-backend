import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressController } from './progress.controller';
import { GradebookService } from './services/gradebook.service';
import { ProgressService } from './services/progress.service';
import { GradeEntity } from './entities/grade.entity';
import { GradeCategoryEntity } from './entities/grade-category.entity';
import { ProgressEntity } from './entities/progress.entity';
import { CourseEntity } from '../courses/entities/course.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { ContentItemEntity } from '../content/entities/content-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GradeEntity,
      GradeCategoryEntity,
      ProgressEntity,
      CourseEntity,
      UserEntity,
      ContentItemEntity,
    ]),
  ],
  controllers: [ProgressController],
  providers: [GradebookService, ProgressService],
  exports: [GradebookService, ProgressService],
})
export class ProgressModule {}
