import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileMetaEntity } from '../entities/file-meta.entity';
import { UploadContentFileDto } from '../dto/upload.dto';
import { ContentItemEntity } from '../entities/content-item.entity';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(FileMetaEntity) private readonly fileRepo: Repository<FileMetaEntity>,
    @InjectRepository(ContentItemEntity) private readonly contentRepo: Repository<ContentItemEntity>,
  ) {}

  async list(contentId: string) {
    await this.ensureContent(contentId);
    return this.fileRepo.find({ where: { contentItemId: contentId } });
  }

  async attach(contentId: string, payload: UploadContentFileDto) {
    await this.ensureContent(contentId);
    const entity = this.fileRepo.create({
      contentItemId: contentId,
      filename: payload.filename,
      mimeType: payload.mimeType,
      url: payload.url,
      size: payload.size,
      storageProvider: payload.provider || 's3',
      metadata: payload.metadata || {},
    });
    return this.fileRepo.save(entity);
  }

  async remove(fileId: string) {
    const file = await this.fileRepo.findOne({ where: { id: fileId } });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    await this.fileRepo.remove(file);
    return { success: true };
  }

  private async ensureContent(contentId: string) {
    const exists = await this.contentRepo.exist({ where: { id: contentId } });
    if (!exists) {
      throw new NotFoundException('Content item not found');
    }
  }
}

