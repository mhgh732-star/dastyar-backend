import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentItemEntity } from './entities/content-item.entity';
import { FileMetaEntity } from './entities/file-meta.entity';
import { PageEntity } from './entities/page.entity';
import { BookEntity } from './entities/book.entity';
import { ContentRepository } from './content.repository';
import { CourseEntity } from '../courses/entities/course.entity';
import { CourseSectionEntity } from '../courses/entities/course-section.entity';
import { ResourceService } from './services/resource.service';
import { EditorService } from './services/editor.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContentItemEntity, FileMetaEntity, PageEntity, BookEntity, CourseEntity, CourseSectionEntity])],
  controllers: [ContentController],
  providers: [ContentService, ContentRepository, ResourceService, EditorService],
  exports: [ContentService],
})
export class ContentModule {}
