import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ContentRepository } from './content.repository';
import { CreateContentDto, ReorderContentDto, UpdateContentDto } from './dto/content.dto';
import { ContentItemEntity } from './entities/content-item.entity';
import { CourseEntity } from '../courses/entities/course.entity';
import { CourseSectionEntity } from '../courses/entities/course-section.entity';
import { UploadContentFileDto } from './dto/upload.dto';
import { ResourceService } from './services/resource.service';
import { EditorService } from './services/editor.service';

@Injectable()
export class ContentService {
  constructor(
    private readonly contentRepository: ContentRepository,
    @InjectRepository(ContentItemEntity) private readonly contentItemRepo: Repository<ContentItemEntity>,
    @InjectRepository(CourseEntity) private readonly courseRepo: Repository<CourseEntity>,
    @InjectRepository(CourseSectionEntity) private readonly sectionRepo: Repository<CourseSectionEntity>,
    private readonly resourceService: ResourceService,
    private readonly editorService: EditorService,
  ) {}

  async listCourseContent(courseId: string) {
    await this.ensureCourse(courseId);
    return this.contentRepository.findCourseContent(courseId);
  }

  async createContent(courseId: string, dto: CreateContentDto, userId: string) {
    await this.ensureCourse(courseId);
    if (dto.sectionId) {
      await this.ensureSection(courseId, dto.sectionId);
    }
    const nextOrder = dto.itemOrder ?? (await this.contentRepository.getNextOrder(courseId));
    const entity = this.contentItemRepo.create({
      courseId,
      sectionId: dto.sectionId,
      title: dto.title,
      contentType: dto.contentType,
      contentBody: dto.contentBody,
      resourceUrl: dto.resourceUrl,
      itemOrder: nextOrder,
      isVisible: dto.isVisible ?? true,
      settings: dto.settings ?? {},
      createdById: userId,
    });
    const saved = await this.contentItemRepo.save(entity);
    await this.editorService.syncPage(saved, dto.contentBody);
    return saved;
  }

  async updateContent(id: string, dto: UpdateContentDto) {
    const content = await this.getContentOrThrow(id);
    if (dto.sectionId) {
      await this.ensureSection(content.courseId, dto.sectionId);
    }
    Object.assign(content, {
      sectionId: dto.sectionId ?? content.sectionId,
      title: dto.title ?? content.title,
      contentType: dto.contentType ?? content.contentType,
      contentBody: dto.contentBody ?? content.contentBody,
      resourceUrl: dto.resourceUrl ?? content.resourceUrl,
      itemOrder: dto.itemOrder ?? content.itemOrder,
      isVisible: dto.isVisible ?? content.isVisible,
      settings: dto.settings ?? content.settings,
    });
    const updated = await this.contentItemRepo.save(content);
    await this.editorService.syncPage(updated, dto.contentBody);
    return updated;
  }

  async reorder(courseId: string, dto: ReorderContentDto) {
    if (!dto.items.length) {
      throw new BadRequestException('items cannot be empty');
    }
    const ids = dto.items.map((item) => item.id);
    const items = await this.contentItemRepo.find({ where: { id: In(ids), courseId } });
    if (items.length !== dto.items.length) {
      throw new NotFoundException('One or more content items were not found');
    }
    await Promise.all(
      dto.items.map(({ id, order }) => this.contentItemRepo.update({ id }, { itemOrder: order })),
    );
    return this.contentRepository.findCourseContent(courseId);
  }

  async removeContent(id: string) {
    const content = await this.getContentOrThrow(id);
    await this.contentItemRepo.softRemove(content);
    return { success: true };
  }

  async listFiles(contentId: string) {
    return this.resourceService.list(contentId);
  }

  async attachFile(contentId: string, dto: UploadContentFileDto) {
    await this.getContentOrThrow(contentId);
    return this.resourceService.attach(contentId, dto);
  }

  async removeFile(fileId: string) {
    return this.resourceService.remove(fileId);
  }

  private async ensureCourse(courseId: string) {
    const exists = await this.courseRepo.exist({ where: { id: courseId } });
    if (!exists) {
      throw new NotFoundException('Course not found');
    }
  }

  private async ensureSection(courseId: string, sectionId: string) {
    const section = await this.sectionRepo.findOne({ where: { id: sectionId, courseId } });
    if (!section) {
      throw new BadRequestException('Section does not belong to course');
    }
  }

  private async getContentOrThrow(id: string) {
    const content = await this.contentItemRepo.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException('Content item not found');
    }
    return content;
  }
}
