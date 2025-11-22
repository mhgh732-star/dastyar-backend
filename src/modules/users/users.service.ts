import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { UserProfileEntity } from './entities/user-profile.entity';
import { UserSettingsEntity } from './entities/user-settings.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from '../../common/utils/password.utils';
import { buildPaginationMeta, normalizePagination, PaginationMeta } from '../../common/utils/pagination.utils';

export interface UsersListResult {
  meta: PaginationMeta;
  items: Array<UserEntity & { profile?: UserProfileEntity; settings?: UserSettingsEntity }>;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity) private readonly profilesRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserSettingsEntity) private readonly settingsRepository: Repository<UserSettingsEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    const exists = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException('Email already registered');
    }

    const user = this.usersRepository.create({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash: await hashPassword(dto.password),
      roles: dto.roles?.length ? dto.roles : ['student'],
    });
    await this.usersRepository.save(user);

    await this.upsertProfile(user.id, {
      jobTitle: dto.jobTitle,
      phone: dto.phone,
      timezone: dto.timezone,
      language: dto.language,
    });

    await this.upsertSettings(user.id, {
      emailNotificationsEnabled: dto.emailNotificationsEnabled,
      pushNotificationsEnabled: dto.pushNotificationsEnabled,
      theme: dto.theme,
    });

    return this.findOne(user.id);
  }

  async findAll(params: { page?: number; limit?: number; search?: string }): Promise<UsersListResult> {
    const pagination = normalizePagination({ page: params.page, limit: params.limit });
    const where = params.search
      ? [
          { firstName: ILike(`%${params.search}%`) },
          { lastName: ILike(`%${params.search}%`) },
          { email: ILike(`%${params.search}%`) },
        ]
      : undefined;

    const [items, total] = await this.usersRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      relations: ['profile', 'settings'],
    });

    return {
      items,
      meta: buildPaginationMeta(total, pagination),
    };
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile', 'settings'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (dto.firstName) user.firstName = dto.firstName;
    if (dto.lastName) user.lastName = dto.lastName;
    if (dto.roles?.length) user.roles = dto.roles;
    await this.usersRepository.save(user);

    await this.upsertProfile(id, {
      jobTitle: dto.jobTitle,
      phone: dto.phone,
      timezone: dto.timezone,
      language: dto.language,
    });

    await this.upsertSettings(id, {
      emailNotificationsEnabled: dto.emailNotificationsEnabled,
      pushNotificationsEnabled: dto.pushNotificationsEnabled,
      theme: dto.theme,
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    return { success: true };
  }

  private async upsertProfile(userId: string, payload: Partial<UserProfileEntity>) {
    const existing = await this.profilesRepository.findOne({ where: { userId } });
    if (existing) {
      Object.assign(existing, payload);
      await this.profilesRepository.save(existing);
      return;
    }
    const profile = this.profilesRepository.create({ userId, ...payload });
    await this.profilesRepository.save(profile);
  }

  private async upsertSettings(userId: string, payload: Partial<UserSettingsEntity>) {
    const existing = await this.settingsRepository.findOne({ where: { userId } });
    if (existing) {
      Object.assign(existing, payload);
      await this.settingsRepository.save(existing);
      return;
    }
    const settings = this.settingsRepository.create({
      userId,
      emailNotificationsEnabled: payload.emailNotificationsEnabled ?? true,
      pushNotificationsEnabled: payload.pushNotificationsEnabled ?? true,
      theme: (payload.theme as any) ?? 'light',
    });
    await this.settingsRepository.save(settings);
  }
}
