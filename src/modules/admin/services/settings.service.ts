import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSettingEntity } from '../entities/system-setting.entity';
import { UpsertSystemSettingDto } from '../dto/system-setting.dto';
import { AuditService } from './audit.service';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SystemSettingEntity) private readonly settingsRepository: Repository<SystemSettingEntity>,
    private readonly auditService: AuditService,
  ) {}

  findAll() {
    return this.settingsRepository.find();
  }

  async upsert(dto: UpsertSystemSettingDto, actorId?: string) {
    let setting = await this.settingsRepository.findOne({ where: { key: dto.key } });
    if (setting) {
      setting.value = dto.value;
    } else {
      setting = this.settingsRepository.create({ key: dto.key, value: dto.value });
    }
    setting.metadata = { ...setting.metadata };
    const saved = await this.settingsRepository.save(setting);
    await this.auditService.log({
      actorId,
      action: 'settings.updated',
      resource: `setting:${dto.key}`,
      metadata: { value: dto.value },
    });
    return saved;
  }
}
