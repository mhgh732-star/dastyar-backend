import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseEntity } from './entities/course.entity';

@Injectable()
export class CoursesRepository {
  constructor(@InjectRepository(CourseEntity) private readonly repository: Repository<CourseEntity>) {}

  findByCode(code: string) {
    return this.repository.findOne({ where: { code } });
  }
}
