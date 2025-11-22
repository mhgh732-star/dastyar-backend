import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity, FileType } from '../entities/file.entity';
import { StorageLocationEntity } from '../entities/storage-location.entity';
import { CourseEntity } from '../../courses/entities/course.entity';
import { UserEntity } from '../../auth/entities/user.entity';
import { UploadFileDto, UpdateFileDto, ListFilesDto } from '../dto/file.dto';
import { GetPresignedUrlDto } from '../dto/upload-presign.dto';
import { StorageService } from './storage.service';

@Injectable()
export class FileManagerService {
  constructor(
    @InjectRepository(FileEntity) private readonly fileRepo: Repository<FileEntity>,
    @InjectRepository(StorageLocationEntity) private readonly storageRepo: Repository<StorageLocationEntity>,
    @InjectRepository(CourseEntity) private readonly courseRepo: Repository<CourseEntity>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    private readonly storageService: StorageService,
  ) {}

  async listFiles(query: ListFilesDto = {}, userId?: string) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb = this.fileRepo
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.uploadedBy', 'uploadedBy')
      .leftJoinAndSelect('file.course', 'course')
      .leftJoinAndSelect('file.storageLocation', 'storageLocation');

    if (query.courseId) {
      qb.andWhere('file.courseId = :courseId', { courseId: query.courseId });
    }

    if (query.fileType) {
      qb.andWhere('file.fileType = :fileType', { fileType: query.fileType });
    }

    if (userId) {
      qb.andWhere('file.uploadedById = :userId', { userId });
    }

    qb.orderBy('file.createdAt', 'DESC');

    const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      items,
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getFile(id: string) {
    const file = await this.fileRepo.findOne({
      where: { id },
      relations: ['uploadedBy', 'course', 'storageLocation'],
    });
    if (!file) throw new NotFoundException('File not found');
    return file;
  }

  async createFile(
    file: { originalname: string; mimetype: string; size: number; buffer: Buffer },
    dto: UploadFileDto,
    userId: string,
  ): Promise<FileEntity> {
    if (dto.courseId) await this.ensureCourse(dto.courseId);
    await this.ensureUser(userId);

    const defaultStorage = await this.getDefaultStorage();
    const fileType = this.detectFileType(file.mimetype);
    const filePath = await this.storageService.uploadFile(file, defaultStorage, dto.courseId);

    const fileEntity = this.fileRepo.create({
      courseId: dto.courseId,
      uploadedById: userId,
      storageLocationId: defaultStorage.id,
      filename: dto.filename ?? file.originalname,
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      fileType,
      filePath,
      url: await this.storageService.getFileUrl(filePath, defaultStorage),
      isPublic: dto.isPublic ?? false,
      metadata: dto.metadata,
    });

    return this.fileRepo.save(fileEntity);
  }

  async updateFile(id: string, dto: UpdateFileDto) {
    const file = await this.getFile(id);
    Object.assign(file, dto);
    return this.fileRepo.save(file);
  }

  async deleteFile(id: string) {
    const file = await this.getFile(id);
    if (file.storageLocation) {
      await this.storageService.deleteFile(file.filePath, file.storageLocation);
    }
    await this.fileRepo.remove(file);
    return { success: true };
  }

  async getFileUrl(id: string) {
    const file = await this.getFile(id);
    if (!file.storageLocation) throw new BadRequestException('File storage location not found');
    return this.storageService.getFileUrl(file.filePath, file.storageLocation);
  }

  async getPresignedUpload(dto: GetPresignedUrlDto, userId: string) {
    if (dto.courseId) {
      await this.ensureCourse(dto.courseId);
    }
    await this.ensureUser(userId);
    const storage = await this.getDefaultStorage();
    return this.storageService.createPresignedUpload(dto, storage);
  }

  private detectFileType(mimeType: string): FileType {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return 'archive';
    return 'other';
  }

  private async getDefaultStorage() {
    const storage = await this.storageRepo.findOne({ where: { isDefault: true, isActive: true } });
    if (!storage) throw new BadRequestException('No default storage location configured');
    return storage;
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
}
