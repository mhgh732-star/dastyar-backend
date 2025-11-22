import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogEntity } from '../entities/audit-log.entity';
import { buildPaginationMeta, normalizePagination } from '../../../common/utils/pagination.utils';

@Injectable()
export class AuditService {
  constructor(@InjectRepository(AuditLogEntity) private readonly auditRepository: Repository<AuditLogEntity>) {}

  async log(entry: { actorId?: string; action: string; resource: string; description?: string; metadata?: Record<string, any> }) {
    const log = this.auditRepository.create(entry);
    await this.auditRepository.save(log);
    return log;
  }

  async list(params: { page?: number; limit?: number }) {
    const pagination = normalizePagination(params);
    const [items, total] = await this.auditRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    });
    return {
      items,
      meta: buildPaginationMeta(total, pagination),
    };
  }
}
