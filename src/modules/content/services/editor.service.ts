import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageEntity } from '../entities/page.entity';
import { ContentItemEntity } from '../entities/content-item.entity';

@Injectable()
export class EditorService {
  constructor(@InjectRepository(PageEntity) private readonly pageRepo: Repository<PageEntity>) {}

  sanitize(body?: string | null) {
    if (!body) return '';
    // حذف script و on* ساده
    const withoutScript = body.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
    return withoutScript.replace(/on\w+="[^"]*"/gi, '');
  }

  async syncPage(content: ContentItemEntity, body?: string | null) {
    if (content.contentType !== 'page') {
      await this.pageRepo.delete({ contentItemId: content.id });
      return null;
    }
    const sanitized = this.sanitize(body ?? content.contentBody ?? '');
    let page = await this.pageRepo.findOne({ where: { contentItemId: content.id } });
    if (!page) {
      page = this.pageRepo.create({
        contentItemId: content.id,
        title: content.title,
        body: sanitized,
        metadata: content.settings || {},
      });
    } else {
      page.title = content.title;
      page.body = sanitized;
      page.metadata = content.settings || {};
    }
    return this.pageRepo.save(page);
  }
}

