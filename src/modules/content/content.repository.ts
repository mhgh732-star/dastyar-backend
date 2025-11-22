import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ContentItemEntity } from './entities/content-item.entity';

@Injectable()
export class ContentRepository extends Repository<ContentItemEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ContentItemEntity, dataSource.createEntityManager());
  }

  findCourseContent(courseId: string) {
    return this.createQueryBuilder('content')
      .leftJoinAndSelect('content.files', 'files')
      .leftJoinAndSelect('content.page', 'page')
      .where('content.courseId = :courseId', { courseId })
      .andWhere('content.deletedAt IS NULL')
      .orderBy('content.itemOrder', 'ASC')
      .getMany();
  }

  async getNextOrder(courseId: string) {
    const result = await this.createQueryBuilder('content')
      .select('MAX(content.itemOrder)', 'max')
      .where('content.courseId = :courseId', { courseId })
      .getRawOne<{ max: number | null }>();
    return (result?.max ?? 0) + 1;
  }
}
